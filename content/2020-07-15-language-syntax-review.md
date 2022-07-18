---
title: Language syntax review
slug: syntax
date: 2020-07-16T20:21:41-04:00
summary: Quick review of basic syntax for Go, Javascript, Ruby, Rails, and SQL
---

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby) · [Rails](#rails) · [SQL](#sql)

---

### Go

#### Basics of Go

```go
var x int // Variable declaration. Variables must be declared before use.
x = 3     // Variable assignment.
// "Short" declarations use := to infer the type, declare, and assign.
y := 4
sum, prod := learnMultiple(x, y)        // Function returns two values.
fmt.Println("sum:", sum, "prod:", prod) // Simple output.

func learnMultiple(x, y int) (sum, prod int) {
  return x + y, x * y // Return two values.
}

 // Arrays have size fixed at compile time.
var a4 [4]int           // An array of 4 ints, initialized to all 0.
// An array initialized with a fixed size of five
// elements, with values 3, 1, 5, 10, and 100.
a5 := [...]int{3, 1, 5, 10, 100}

// Slices have dynamic size. Arrays and slices each have advantages
// but use cases for slices are much more common.
s3 := []int{4, 5, 9}    // Compare to a5. No ellipsis here.
s4 := make([]int, 4)    // Allocates slice of 4 ints, initialized to all 0.
var d2 [][]float64      // Declaration only, nothing allocated here.
bs := []byte("a slice") // Type conversion syntax.

// Slices (as well as maps and channels) have reference semantics.
s3_cpy := s3            // Both variables point to the same instance.
s3_cpy[0] = 0           // Which means both are updated.
fmt.Println(s3_cpy[0] == s3[0]) // true

// Because they are dynamic, slices can be appended to on-demand.
// To append elements to a slice, the built-in append() function is used.
// First argument is a slice to which we are appending. Commonly,
// the array variable is updated in place, as in example below.
s := []int{1, 2, 3}     // Result is a slice of length 3.
s = append(s, 4, 5, 6)  // Added 3 elements. Slice now has length of 6.
fmt.Println(s) // Updated slice is now [1 2 3 4 5 6]

// To append another slice, instead of list of atomic elements we can
// pass a reference to a slice or a slice literal like this, with a
// trailing ellipsis, meaning take a slice and unpack its elements,
// appending them to slice s.
s = append(s, []int{7, 8, 9}...) // Second argument is a slice literal.
fmt.Println(s)  // Updated slice is now [1 2 3 4 5 6 7 8 9]
```

#### Flow Control in Go

```go
// No parentheses for if / else
if x > y {
  // ...
} else {
  // ...
}

// Like if, for doesn't use parens either.
// Variables declared in for and if are local to their scope.
for x := 0; x < 3; x++ { // ++ is a statement.
  fmt.Println("iteration", x)
}

// You can use range to iterate over an array, a slice, a string, a map, or a channel.
// range returns one (channel) or two values (array, slice, string and map).
hashMap := map[string]int{"one": 1, "two": 2, "three": 3}
for key, value := range hashMap {
  // for each pair in the map, print key and value
  fmt.Printf("key=%s, value=%d\n", key, value)
}

// If you only need the value, use the underscore as the key
names := []string{"Bob", "Bill", "Joe"}
for _, name := range names {
  fmt.Printf("Hello, %s\n", name)
}

for { // Infinite loop.
  break    // Just kidding.
  continue // Unreached.
}
```

#### References for Go

- [Learn Go in Y Minutes](https://learnxinyminutes.com/docs/go/)
- [A Tour of Go](https://go.dev/tour)

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby) · [Rails](#rails) · [SQL](#sql)

---

### Javascript

#### Basics of Javascript

```javascript
// The "var" keyword, function scope aka hoisted to top.
var someVar = 5

// The "let" keyword allows you to define variables in a lexical scope (block),
// as opposed to a function scope like the var keyword does.
let name = 'Billy'
name = 'William' // Can do this

// The "const" keyword allows you to define a variable in a lexical scope
// like with let, but you cannot reassign the value once one has been assigned.
const pi = 3.14
pi = 4.13 // Can NOT do this

// There's shorthand for performing math operations on variables:
someVar += 5 // equivalent to someVar = someVar + 5; someVar is 10 now
someVar *= 10 // now someVar is 100

// and an even-shorter-hand for adding or subtracting 1
someVar++ // now someVar is 101
someVar-- // back to 100

// Strings
'hello'.length // 5
'hello'.charAt(0) // "h"
'hello, world'.replace('world', 'mars') // "hello, mars"
'hello'.toUpperCase() // "HELLO"

// Gotchas
//
3 / 2 // 1.5, not 1
Math.floor(3 / 2) // 1
0.1 + 0.2 == 0.30000000000000004 // Floats

// Avoid type coercion, use the triple-equals operator:
123 === '123' // false
1 === true // false
// vs
123 == '123' // true
1 == true // true
```

#### Flow Control in Javascript

```javascript
if (count === 3) {
  // evaluated if count is 3
} else if (count === 4) {
  // evaluated if count is 4
} else {
  // evaluated if it's not either 3 or 4
}

while (stack.length !== 0) {
  // ...
}

// Basic for loop
// initialization; continue condition; iteration.
for (let i = 0; i < 5; i++) {
  // will run 5 times
}

// The for/in statement allows iteration over properties of an object.
let description = ''
let person = { first: 'Paul', last: 'Ken', age: 18 }
for (let x in person) {
  description += person[x] + ' '
} // description = 'Paul Ken 18 '

// The for/of statement allows iteration over iterable objects (including the built-in String,
// Array, e.g. the Array-like arguments or NodeList objects, TypedArray, Map and Set,
// and user-defined iterables).
let myPets = ''
let pets = ['cat', 'dog', 'hamster', 'hedgehog']
for (let pet of pets) {
  myPets += pet + ' '
} // myPets = 'cat dog hamster hedgehog '
```

#### Hash Maps in Javascript

```javascript
const cache = new Map()

cache.set('a', 1) // Set key and value
cache.has('a') // Key exists?
cache.get('a') // Get value or `undefined`
cache.delete('a') // Delete element by key, returns true on success, or false if not found
```

#### Arrays in Javascript

```javascript
const array1 = [1, 2, 3];
array1.includes(2)) // true
array1.includes(3)) // false
```

Stacks and Queues

```javascript
// Stacks (LIFO)
const stack = []
while (stack.length !== 0) {
  let a = stack.pop()
  // ...
  stack.push(b)
}

// Queues (FIFO)
const queue = []
while (queue.length !== 0) {
  let a = queue.shift()
  // ...
  queue.push(b)
}

// More
const queue2 = [1, 2]
queue2.unshift(0) // result of the call is 3, which is the new array length
// queue2 is [0, 1, 2]
```

#### ES6 Additions

```javascript
// There is a new syntax for functions in ES6 known as "lambda syntax".
// This allows functions to be defined in a lexical scope like with variables
// defined by const and let.
const isEven = (number) => {
  return number % 2 === 0
}

isEven(7) // false

// The "equivalent" of this function in the traditional syntax would look like this:
function isEven(number) {
  return number % 2 === 0
}
```

#### API Call and Parse JSON in Javascript

```javascript
// Using node-fetch since fetch() included in NodeJS 17.5+ only
import fetch from 'node-fetch'

let API_URL_WITH_PARAMS = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'

// Current approach - Fetch API
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
fetch(API_URL_WITH_PARAMS)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error))

// Old approach - XMLHttpRequest
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
//
// function reqListener() {
//   console.log(this.responseText)
// }

// var oReq = new XMLHttpRequest()
// oReq.addEventListener('load', reqListener)
// oReq.open('GET', API_URL_WITH_PARAMS)
// oReq.send()
```

#### References for Javascript

- [MDN Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Javascript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [A Re-introduction to Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [Learn Javascript in Y Minutes](https://learnxinyminutes.com/docs/javascript/)

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby) · [Rails](#rails) · [SQL](#sql)

---

### Ruby

#### Basics of Ruby

```ruby
# In Ruby, (almost) everything is an object.
# This includes numbers...
3.class #=> Integer

# Some basic arithmetic
1 + 1 #=> 2
8 - 1 #=> 7
10 * 2 #=> 20
35 / 5 #=> 7
2 ** 5 #=> 32
5 % 3 #=> 2

# Bitwise operators
3 & 5 #=> 1
3 | 5 #=> 7
3 ^ 5 #=> 6

# Create array with max distance
cache = Hash.new(0)
cache = Array.new(size, 0)

# Matrix m x n size, use rows and cols are the size of each, for clarity
rows = matrix.size
cols = matrix[0].size
output = Array.new(rows).map { Array.new(cols, 0) }
```

#### More Ruby

To quickly create a hash map in Ruby 2.7+ use the `#tally` method

```ruby
# Ruby 2.7+
cache = s.chars.tally

# vs
cache = s.chars.each_with_object(Hash.new(0)) { |v, h| h[v] += 1 }

# vs
cache = Hash.new(0)
s.chars.each { |c| cache[c] += 1 }
```

#### Flow Control in Ruby

```ruby
# The `do |variable| ... end` construct above is called a 'block'. Blocks are similar
# to lambdas, anonymous functions or closures in other programming languages. They can
# be passed around as objects, called, or attached as methods.
#
# The 'each' method of a range runs the block once for each element of the range.
# The block is passed a counter as a parameter.

# You can also surround blocks in curly brackets.
(1..5).each { |counter| puts "iteration #{counter}" }

# The contents of data structures can also be iterated using each.
array.each do |element|
  puts "#{element} is part of the array"
end
hash.each do |key, value|
  puts "#{key} is #{value}"
end

# If you still need an index you can use 'each_with_index' and define an index
# variable.
array.each_with_index do |element, index|
  puts "#{element} is number #{index} in the array"
end

counter = 1
while counter <= 5 do
  puts "iteration #{counter}"
  counter += 1
end
```

#### Hash Maps in Ruby

```ruby
# Hashes are Ruby's primary dictionary with key/value pairs.
# Hashes are denoted with curly braces.
cache = { }

cache['a'] = 1    # Set key and value
cache.key?('a')   # Key exists?
cache['a']        # Get value or `nil`
cache.delete('a') # Delete element by key, returns value on success or `nil` if  not found
```

#### Arrays in Ruby

```ruby
array1 = [1, 2, 3]
array1.include?(1) # true
array1.include?(4) # false
```

Stacks and Queues in Ruby

```ruby
# Stacks (LIFO)
stack = []
until stack.empty?
  a = stack.pop
  # ...
  stack.append(b) # Alias for .push
end

# Queues (FIFO)
queue = []
until queue.empty?
  a = queue.shift
  # ...
  queue.append(b)
end

# More
queue.unshift(c) # Prepend to array (aliased as .prepend)
```

#### API Call and Parse JSON in Ruby

```ruby
# A simple review of Ruby's built in net/http, uri, and json libraries
# used to make API requests and parse the JSON response.
# require 'pry'
require 'uri'
require 'net/http'
require 'json'

# Option 1 - include params in GET request
# API_URL_WITH_PARAMS = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
# uri = URI(API_URL_WITH_PARAMS)

# Option 2 - construct query with dynamic params
API_URL = 'https://api.nasa.gov/planetary/apod'
uri = URI(API_URL)
params = { api_key: 'DEMO_KEY' }
uri.query = URI.encode_www_form(params)

res = Net::HTTP.get_response(uri)
parsed = JSON.parse(res.body)
puts parsed
```

#### References for Ruby

- [Core Docs](https://ruby-doc.org/core-3.1.2/)
  - [Hash](https://ruby-doc.org/core-3.1.2/Hash.html)
  - [Array](https://ruby-doc.org/core-3.1.2/Array.html)
- [Learn Ruby in Y Minutes](https://learnxinyminutes.com/docs/ruby/)

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby) · [Rails](#rails) · [SQL](#sql)

---

### Rails

#### Generators

```ruby
rails generate <type> --help # for examples

# Model (+ migration, test, fixtures)
# rails generate model NAME [field[:type][:index] field[:type][:index]] [options]
rails generate model post title:string blog:references published:boolean position:integer
rails generate model product supplier:references{polymorphic}

# Migration
# rails generate migration NAME [field[:type][:index] field[:type][:index]] [options]
rails generate migration AddTitlePublishedToPost title:string published:boolean
```

#### Models code order (preference)

```ruby
class User < ApplicationRecord
  # concerns first
  include HasUniqueIdentifier

  # default scope (if any, hopefully none)
  default_scope { where(active: true) }

  # constants
  GENDERS = {
    unknown:       0,
    female:        1,
    male:          2,
    non_binary:    3,
    not_disclosed: 4
  }.freeze

  # attr related macros
  attr_accessor :formatted_date_of_birth

  # enums after attr macros, prefer the hash syntax (GENDERS constant is a hash)
  enum gender_enum: GENDERS, _prefix: :gender

  # association macros
  belongs_to :country

  has_many :authentications, dependent: :destroy

  # validation macros
  validates :email,
            :username, presence: true
  validates :username, uniqueness: { case_sensitive: false } }

  # callbacks
  after_create  :accept_latest_terms!,    unless: :created_by_invite?

  # scopes
  scope :published, -> { where(published: true) }

  # delegations
  delegate :currency, to: :country

  # class methods
  def self.by_email(email)
    # ...
  end

  # instance methods
  def name
    # ...
  end

  private

  # callback methods
  def accept_latest_terms!
    # ...
  end
```

#### Routes

- Try to always use ["resourceful" routes in Rails](https://guides.rubyonrails.org/routing.html#resource-routing-the-rails-default)
- Always write routing tests/specs first, with the same code change as the routes themselves

```ruby
# config/routes.rb
Rails.application.routes.draw do
  resources :networks, only: [] do
    resources :devices
    resource :topology, only: :show # singular "show"-only route
  end

  namespace :app do                 # namespace adds module (folder) AND prefix '/app' to URI
    scope ':account_slug' do        # scope just adds prefix :account_slug to URI
      resources :messages, only: %i[index edit]
    end
  end

  scope module: :billing do         # scope module adds module (folder) only, no prefix to URI
    resources :plans, only: :index
  end
end

# Produces:
#              Prefix Verb   URI Pattern                                      Controller#Action
#     network_devices GET    /networks/:network_id/devices(.:format)          devices#index
#                     POST   /networks/:network_id/devices(.:format)          devices#create
#  new_network_device GET    /networks/:network_id/devices/new(.:format)      devices#new
# edit_network_device GET    /networks/:network_id/devices/:id/edit(.:format) devices#edit
#      network_device GET    /networks/:network_id/devices/:id(.:format)      devices#show
#                     PATCH  /networks/:network_id/devices/:id(.:format)      devices#update
#                     PUT    /networks/:network_id/devices/:id(.:format)      devices#update
#                     DELETE /networks/:network_id/devices/:id(.:format)      devices#destroy
#    network_topology GET    /networks/:network_id/topology(.:format)         topologies#show
#        app_messages GET    /app/:account_slug/messages(.:format)            app/messages#index
#    edit_app_message GET    /app/:account_slug/messages/:id/edit(.:format)   app/messages#edit
#               plans GET    /plans(.:format)                                 billing/plans#index
```

Example tests

```ruby
# spec/routing/devices_routing_spec.rb
require 'rails_helper'

RSpec.describe DevicesController, type: :routing do
  describe 'routing' do
    it 'routes to #show' do
      expect(get: '/networks/1/devices/2').to route_to('devices#show', network_id: '1', id: '2')
    end

    it 'routes to #new' do
      expect(get: '/networks/1/devices/new').to route_to('devices#new', network_id: '1')
    end

    it 'routes to #create' do
      expect(post: '/networks/1/devices').to route_to('devices#create', network_id: '1')
    end

    it 'routes to #update' do
      expect(put:   '/networks/1/devices/2').to route_to('devices#update', network_id: '1', id: '2')
      expect(patch: '/networks/1/devices/2').to route_to('devices#update', network_id: '1', id: '2')
    end

    it 'routes to #destroy' do
      expect(delete: '/networks/1/devices/id123').to route_to('devices#destroy', network_id: '1', id: 'id123')
    end
  end
end
```

#### References for Rails

- [Rails Guides](https://guides.rubyonrails.org/)


Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby) · [Rails](#rails) · [SQL](#sql)

---

### SQL

#### Basics of SQL

```sql
-- Always use syntax that explicitly lists column order when inserting data
INSERT INTO
    weather (city, temp_lo, temp_hi, prcp, date)
VALUES
    ('San Francisco', 43, 57, 0.0, '1994-11-29');

-- Aggregate
SELECT
    city,
    max(temp_lo)
FROM
    weather
GROUP BY
    city;

-- Filter grouped rows, using HAVING
SELECT
    city,
    max(temp_lo)
FROM
    weather
GROUP BY
    city
HAVING
    max(temp_lo) < 40;
```

#### Advanced SQL

```sql
-- Find duplicates using having count(*) > 1
select
    count(*) as duplicate_reports_count,
    day_id, receiver_name, domain, account_slug, identifier
from
    table_name
group by
    day_id, receiver_name, domain, account_slug, identifier
having
    count(*) > 1;

-- Example of case statement, to_char() to format float as a percent.
select
    day_id,

    case
        when (sum(passing_count) / sum(messages_count)::float >= 0.95) then 'passing'
        when (sum(passing_count) / sum(messages_count)::float <= 0.50) then 'failing'
        else 'partially passing'
    end as status,

    to_char(
        sum(messages_count) / sum(count)::float * 100.0, '999D9%'
    ) as passing_pct,

    sum(messages_count) as total_messages_count,
from
    group_originating_and_geo_by_day_ids
where
    day_id >= 20191001
    and day_id <= 20191231
    and account_slug = 'sales-demos'
    and originating_esp_slug != 'internal'
    and originating_esp_slug != 'unknown'
group by
    day_id,
    dmarc_policy_org_domain,
    originating_esp_slug
order by
    day_id desc
limit
    1000
;
```

#### Advanced - Window Functions SQL

> A window function performs a calculation across a set of table rows that are somehow related to the current row. This is comparable to the type of calculation that can be done with an aggregate function. However, window functions do not cause rows to become grouped into a single output row like non-window aggregate calls would. Instead, the rows retain their separate identities. Behind the scenes, the window function is able to access more than just the current row of the query result.

> Here is an example that shows how to compare each employee's salary with the average salary in his or her department:

```sql
SELECT
    depname,
    empno,
    salary,
    avg(salary)
OVER (PARTITION BY depname)
FROM
    empsalary;
```

#### VACUUM

Why `VACUUM`?

> In normal PostgreSQL operation, tuples that are deleted or obsoleted by an
> update are not physically removed from their table; they remain present until
> a VACUUM is done. Therefore it's necessary to do VACUUM periodically,
> especially on frequently-updated tables.
> ([reference](https://www.postgresql.org/docs/11/sql-vacuum.html))

`VACUUM ANALYZE` performs a `VACUUM` and then an `ANALYZE` for each selected
table.

`ANALYZE` updates statistics used by the planner to determine the most efficient
way to execute a query.

`VACUUM FULL` reclaims more space, but takes much longer and **exclusively locks
the table**. This method also requires extra disk space, since it writes a new
copy of the table and doesn't release the old copy until the operation is
complete.

#### Admin SQL

```sql
-- Cancel a query
SELECT pg_cancel_backend(<query_id>);

-- Get role members and grantors
select a.roleid, b.rolname rolename, a.member, c.rolname membername, a.grantor, d.usename grantorname, a.admin_option
from pg_auth_members a
join pg_roles b
on a.roleid = b.oid
join pg_roles c
on a.member = c.oid
join pg_user d
on a.grantor = d.usesysid;
```

#### References for SQL

- [PostgreSQL Docs](https://www.postgresql.org/docs/current/)
  - [SQL Syntax](https://www.postgresql.org/docs/current/sql.html)
- [EXPLAIN - depesz](https://explain.depesz.com/)
- [Postgres post - Brian Sigafoos](/postgres)

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby) · [Rails](#rails) · [SQL](#sql)
