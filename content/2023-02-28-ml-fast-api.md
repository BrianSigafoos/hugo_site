---
title: FastAPI for ML inference
slug: ml-fast-api
date: 2023-02-28T14:44:16-05:00
summary: How to use FastAPI for machine learning inference, Docker-ized and deployed using Kubernetes
collection_swe_toolbox: true
---

## TL;DR

- [FastAPI](https://fastapi.tiangolo.com/) is a great way to quickly get a REST API running in development for machine learning model inference.
- It's easy to Dockerize it and deploy it to Kubernetes for production.
- It uses Python types to automatically do validation and generate OpenAPI docs that are interactive.
- Here's a demo repo: [BrianSigafoos/docker-fastapi-ml-inference](https://github.com/BrianSigafoos/docker-fastapi-ml-inference) that should be fully working locally and is deployable to Kubernetes as well
- It easy to follow security best practices for Kubernetes, including running as a non-root user on an immutable file system

## Why FastAPI?

[FastAPI](https://fastapi.tiangolo.com/) is fast to build, iterate, and deploy.
It uses Python types to automatically do validation and generate OpenAPI docs that are interactive.
For machine learning model inference, it's a great way to quickly get a REST API running in development.
It's also easy and fast to Dockerize it and deploy it to Kubernetes for production.

## The power of Python type hints

From the [FastAPI docs](https://fastapi.tiangolo.com/python-types/#type-hints-in-fastapi):

By declaring parameters with type hints, you get:

- Editor support
- Type checks

And FastAPI uses the same declarations to:

- Define requirements: request path parameters, query parameters, etc.
- Convert data: from the request to the required type
- Validate data: coming from each request:
- Generate automatic errors returned to the client when the data is invalid.
- Document the API using OpenAPI in an interactive UI, ie no need for Postman, just use your browser to test the API

## FastAPI setup

Check our `main.py` in the demo repo [here](https://github.com/BrianSigafoos/docker-fastapi-ml-inference/blob/main/app/main.py)
for this example of setting up FastAPI with a redirect to the auto-built /docs.

Plus 2 simple health check endpoints, one for the load balancer and one for the app.

```python
import os
from datetime import datetime, timezone

from fastapi import FastAPI
from starlette.responses import RedirectResponse

from app.env import load_env_vars

app = FastAPI()

load_env_vars()

booted_at = {}


@app.on_event("startup")
def startup_event():
    booted_at["time"] = datetime.now(timezone.utc)


# Redirect base url to /docs
@app.get("/")
def redirect_to_docs():
    return RedirectResponse(url="/docs")

# ...

@app.get("/health_check")
def health_check():
    return {
        "aws_region": os.environ.get("AWS_REGION"),
        "booted_at": booted_at.get("time"),
        "health": "OK",
        "k8s_env": os.environ.get("K8S_ENV"),
        "python_env": os.environ["PYTHON_ENV"],
        "titanic_model_version": TITANIC_MODEL_VERSION,
        "version": os.environ.get(
            "APP_REVISION", "Missing $APP_REVISION env var, not set"
        ),
    }


# Don't render JSON for load balancer health check, just return 200
@app.get("/health_check/load_balancer")
def health_check_load_balancer():
    return
```

## Add an inference endpoint

Next in `main.py` we add an inference endpoint, something like:

```python
@app.post(
    "/predict_survival_by_passengers", response_model=SurvivalPredictionByPassengerIds
)
def predict_survival_by_passengers(passengers: list[Passenger]):
    # Convert passengers to a list of dicts; this is what the model expects
    # There must be a better way to do this.
    passengers = [passenger.dict() for passenger in passengers]

    # Make predictions
    results = [] if not passengers else titanic_survival_predict(passengers)

    return {
        "predictions": results,
        "metadata": {
            "titanic_model_version": TITANIC_MODEL_VERSION,
        },
    }
```

That endpoint simply calls the `predict()` function (here as `titanic_survival_predict()`) that loads the model and makes predictions. See [demo app for more code](https://github.com/BrianSigafoos/docker-fastapi-ml-inference/blob/main/app/titanic_survival/model.py)

FastAPI handles the type checking, validation, and most errors for us automatically.

## Dockerize

I've found [poetry](https://python-poetry.org/) to be a best way to manage dependencies and you'll see `poetry` commands in the `Dockerfile` below.

Here's the `Dockerfile`:

```dockerfile
# Versions with defaults. Override with env var to build a different version.
ARG PYTHON_VERSION=3.11

# More args
# For security, set a non-root user. Name is arbitrary.
ARG USER=nonroot
ARG USER_ID=1001
ARG PYTHON_ENV=production

# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:${PYTHON_VERSION}-slim-buster

# Args needed for this container
ARG USER
ARG USER_ID
ARG PYTHON_ENV

ENV PYTHON_ENV=${PYTHON_ENV}

# Recommended by hadolint
# https://github.com/hadolint/hadolint/wiki/DL4006
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Add non-root user
RUN groupadd --gid $USER_ID $USER \
  && useradd --uid $USER_ID --gid $USER --shell /bin/bash --create-home $USER

# Create a directory for the app code
RUN mkdir /app \
  && chown -R $USER:$USER /app

WORKDIR /app

# Copy dependency definitions for production-only requirements
COPY --chown=$USER:$USER pyproject.toml ./pyproject.toml

# Install poetry
RUN pip install poetry
# Don't create a virtualenv, we'll use the container's python so everything else just works
RUN poetry config virtualenvs.create false
# Install production-only dependencies
RUN poetry install --without dev,test

# COPY the app code that is needed to start the server and run the app
# This will be at `app/app` in the container.
COPY --chown=$USER:$USER app app
COPY --chown=$USER:$USER .env.production .env.production

# Set user to non-root $USER
# This needs to be the numeric uid, not the username, for the k8s
# securityContext: runAsNonRoot check to work.
USER $USER_ID

# https://www.uvicorn.org/deployment/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

## Kubernetes deployment and security best practices

Assuming you already have an existing Kubernetes cluster, it's straightforward to deploy this app. Check out the demo app's [kubernetes/](https://github.com/BrianSigafoos/docker-fastapi-ml-inference/blob/main/kubernetes) directory for the deployment and service specs.

I always recommend following the [NSA/CISA Kubernetes Hardening Guidance](https://www.nsa.gov/News-Features/Feature-Stories/Article-View/Article/2716980/nsa-cisa-release-kubernetes-hardening-guidance/) as much as possible.

In the demo app, you'll notice it follows some key security recommendations:

- Use containers built to run applications as non-root users (see the Dockerfile for "nonroot" USER setup and USER_ID)
- Where possible, run containers with immutable file systems
- Preventing privileged containers
- Rejecting containers that execute as the root user or allow elevation to root

The [demo app](https://github.com/BrianSigafoos/docker-fastapi-ml-inference) does the checked ones above and everyone really should. They're straightforward to implement.
See the Dockerfile for "nonroot" USER setup and USER_ID

The other parts are as simple as passing some options in the [K8s Deployment spec](https://github.com/BrianSigafoos/docker-fastapi-ml-inference/blob/main/kubernetes/base/deployment.yaml)

```yaml
spec:
  securityContext:
    # Must match Dockerfile's USER_ID for User and Group
    runAsUser: 1001
    runAsGroup: 1001
    # Set ownership of mounted volumes to the user running the container
    fsGroup: 1001

  # https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#container-v1-core
  containers:
    - name: demo-fastapi-ml-container
      image: ghcr.io/briansigafoos/docker-fastapi-ml-inference
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
```

## Wrapping up

FastAPI is a great framework for building APIs, including for machine learning model inference. It's easy to use, has great documentation, and is fast. It's also easy to Dockerize and to deploy to Kubernetes.

Check out the [demo app code](https://github.com/BrianSigafoos/docker-fastapi-ml-inference) and let me know what you think.
