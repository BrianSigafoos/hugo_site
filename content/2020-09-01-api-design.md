---
date: 2020-09-01T14:00:00-07:00
slug: api-design
title: API design patterns
summary: Key principles and learnings for API design
collection_swe_toolbox: true
---

Update 2022: I'm glad I captured these notes in 2020 for reference in future API design work. But, from 2021-2022, I saw 2-5x faster product development without an API. See this post:
[A modern app tech stack, built for speed](/app-tech-stack-2021)

---

## Principles

- RESTful API only
- URL-based API version, ex: `/api/v2/`, and not sent in the request header
- Use underscore formatting for all attributes, ex: `created_at`, and not `createdAt` (camelCase)
- Decide ahead of time on nested vs shallow routes use cases
- HATEOAS returns API permissions via links for `{ create: ..., update: ..., delete: ... }`
- Frontend I18n lookups based on sensible symbol/keys returned in English only
- Uniform HTTP status error codes (see section below)
- Error objects are returned in a standard format
- Standardize data formats (see section below)
- Meaningful attributes returned to client
  - Replace `status` or `state` with something more descriptive and clear, like `payment_status`
  - In OpenAPI schema, always provide possible values returned in the enum: to let the client know what to expect.
- POST/PUT params MUST be
  - Passed as a nested hash in the body
  - Underneath the snake cased resource name as a key (e.g. `{ user: {} }`)
- All actions returning a collection (INDEX) have pagination
  - Sorting is determined per endpoint and is optional. If sorting is not allowed the default sort MUST be explicit in the documentation.
- Never serialize has_many of relationships data (see section below)
- Reserve the `page` query parameter for pagination: `?page[per_page]=25` / `?page[number]=1`
- Reserve the `sort` query parameter for sorting: `?sort=field1,-field2` / `?sort=name`
  - A sort field MUST be ascending unless marked with a minus (-) prefix to be descending
- Reserve the `filter` query parameter for filtering: `?filter[field1]=value1&filter[field2]=value2` (see below)
- Reporting endpoints should have their own namespace `reporting` and use the SHOW action
- Define and follow a "blueprint" for releasing new API endpoints (see below)

## Uniform HTTP status error codes

Decision tree for error handling logic MUST be followed:

- Return 401 only if login and not authenticated
- Return 404, to prevent leaking information, if any condition is not met:
  - authenticated
  - resource found
  - access to view resource
- Return 403 if can’t perform action on resource, but has access to view resource
- Return 400 if there are parameter errors
- Return 422 if validation error

## Error objects

Always in English only, the frontend will be responsible for I18n using the code key to lookup the I18n value:

- `status` HTTP status code
- `code` meaningful error code underscored. Ex: already_exists
- `title`
- `source`
  ex: for a request parameter - `password`
  ex: for a query parameter - `filter[first_name]`
- `meta` for returning user inputted values or other things needed for i18n

## Standardize data formats

Standardize data formats

- Date/time attributes have the suffix `_at` like `created_at` or `received_at`
- Date/time return using ISO8601, powered by time_formats.rb initializer

```ruby
date_formats = {
  api_date:     '%F',     # 2020-09-01,          - ISO8601 date
  api_datetime: '%FT%TZ'  # 2018-09-01T04:05:06Z - ISO8601 timestamp - UTC
}

Time::DATE_FORMATS.merge! date_formats
Date::DATE_FORMATS.merge! date_formats
```

- Servers and clients MUST use this standard date format for the API.
- Boolean attributes should fill in the blank "This is …" or "This has …". Should not be prefixed with `is_` or `has_` like is_configured or `has_two_factor_enabled`. Instead: "This is `configured`" and "This has `two_factor_enabled`"
- Integer counts end in `_count`, not `_ct`

## Serialization of relationships

- has_many
  - Never serialize attributes
  - Always include "links": { "related": { "href": …, "meta": { … } }
    - "href" HATEOAS links for create: if permission allows
    - "meta" includes total_count
      - Always add a database counter_cache to support this total_count
- has_one / belongs_to
  - Option per endpoint to:
    - fully serialize attributes, or
    - serialize a summary of attributes, or
    - return nothing for this relation
  - Add HATEOAS links for optional singular resources, per permission:
    - If exists already, show/update/destroy
    - If doesn’t exist yet, only create

## Filtering

- Filtering is additive. Each filter is applied to the resource.
- A parameter may take multiple values through comma separated values.

```text
?filter[job_status]=[complete,queued] # job_status of complete or queued
```

- If advanced features beyond equality with a value are required, the use of operators may be implemented.
- Shorthand representation of operators SHOULD be used. These include but are not limited to:

```text
ne = not equals
lt = less than
gt = greater than
lte = less than or equals
gte = greater than or equals
```

Right Hand Side (RHS) Colon MUST be used to convey additional operators and values for a parameter

```text
?filter[balance]=gt:1000        # filter for balances greater than 1000.
```

## Blueprint for releasing new API endpoints

Each step should be a separate PR to quickly get the changes in to the main branch.

1. Define RESTful routes + routing specs
2. Define OpenAPI schema
3. Define Resource policy + policy specs
4. Define serializer + serializer specs
5. Define controller + request specs
