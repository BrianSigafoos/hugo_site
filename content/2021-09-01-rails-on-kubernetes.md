---
date: 2021-09-01T21:03:13-05:00
slug: rails-on-kubernetes
title: Rails on Kubernetes
summary: Build a CI/CD pipeline with Github Actions to Kubernetes for a Ruby on Rails app
---

### TL;DR

- Invest the time to learn Kubernetes and move to CD (Continuous Deployment)
- Streamline your Docker setup with 1 Dockerfile and 1 docker-compose targeting the "development" stage of the Dockerfile's multi-stage build
- Use Kustomize, and not Helm, to simplify your Kubernetes configuration
- Github Actions makes CI/CD easy (Continuous Integration / Continuous Deployment)
- Handle database migrations with: deploy new code, then migrate. This will require "safe" migrations and more deployments, which thanks to K8s are now trivially easy. Always follow the recommendations in the [strong_migrations](https://github.com/ankane/strong_migrations#removing-a-column) gem
- Switch to PUMA app server, from Passenger or anything else
- Use Liveness probes to ensure unresponsive containers are killed and replaced, including for Sidekiq thanks to the [sidekiq_alive](https://github.com/arturictus/sidekiq_alive) gem.
- Do as many of the published security best practices as possible for Kubernetes, starting with non-root user, read-only file system, and no privilege escalation.

### Why Kubernetes, and why Docker?

It's essential to learn how to use containerize apps (Docker) and deploy using Kubernetes. Going from a few scheduled deploys a week to multiple adhoc deploys a day feels revolutionary.

At my work, we deployed more in the first 3 days using Kubernetes than in the previous 3 months using Terraform blue/green deployments.

### Docker principles

Follow these guidelines and check out the [demo app repo](https://github.com/BrianSigafoos/docker-rails-webpacker-app) to see how it works.

- One `Dockerfile` with multi-stage builds to support both development and production builds.
  - Thanks to [Docker multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/), we can target both development and production builds in 1 easy to maintain Dockerfile
- One `docker-compose.yml` to target only the "development" stage of the Dockerfile, optimized for development speed, aka engineer happiness.
  - Make Docker fast enough for development with persisted volumes for all dependencies and generated content (bundle node_modules, packs, etc)
  - Get as close as possible to local / non-Docker development speed with separate webpack-dev-server and HMR - hot module reloading
  - All credit goes to [Ruby on Whales](https://evilmartians.com/chronicles/ruby-on-whales-docker-for-ruby-rails-development) for this and much of the Dockerfile development target

### Automate everything for local development

This goes along with my post to [Auto-format and lint everything](/linters)

- Automate setting up Docker/local development with VS Code tasks.

  - Run "build" tasks in VS Code that open/reload multiple shells for either:
    - Docker development
    - Local development

  See [tasks setup in the demo app repo](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/.vscode/tasks.json).

### Kubernetes pre-requisites

Getting Kubneretes running on a hosted cloud provider like AWS via their EKS is thankfully getting easier over time..

Still, there's a lot to set up. A production AWS EKS cluster will have something like this:

- deploy user in EKS
- [cluster autoscaler](https://github.com/kubernetes/autoscaler)
- [AWS load balancer controller](https://github.com/kubernetes-sigs/aws-load-balancer-controller)
- [external DNS](https://github.com/kubernetes-sigs/aws-load-balancer-controller)
- [image_pull_secrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-pod-that-uses-your-secret)
- [reflector](https://github.com/emberstack/kubernetes-reflector)
- [metrics server](https://github.com/kubernetes-sigs/metrics-server/)
- [Grafana](https://github.com/grafana/grafana)
- [Loki](https://github.com/grafana/loki)
- [Promtail](https://grafana.com/docs/loki/latest/clients/promtail/)

Install [Oh My Zsh](https://ohmyz.sh/) and add the `kubernetes` plugin
to benefit from all the shortcuts below like `k ...` and `kgp`, etc.

Here's a [gist with the list of K8s Oh My Zsh aliases](https://gist.github.com/BrianSigafoos/ad634a5be27b42a27c7222f813ec19bd)

### Kubernetes configuration secrets

Store in your password manager, as something like "demoapp k8s .env.production.local".
Copy and paste the contents to a `.env.production.local` file.

Next, create a secret using that new file (do not commit it!):

```shell
# Create namespace
kubectl create namespace demoapp

# Add secret named "demoapp-secrets" as a generic type of secret from file
# with many entries.
# https://kubernetes.io/docs/concepts/configuration/secret/
kubectl -n demoapp create secret generic demoapp-secrets --from-env-file='.env.production.local'

# Show this secret
kubectl -n demoapp describe secret demoapp-secrets

# Clean up prod secrets from local machine
rm .env.production.local
```

Editing secrets

```shell
# Check secrets
kubectl get secret
# List all secrets
kubectl describe secret
# Show this secret
kubectl describe secret demoapp-secrets

# Delete secret
kubectl delete secrets demoapp-secrets

# Edit secrets to change/update
kubectl edit secrets demoapp-secrets
```

## Kubernetes configuration using Kustomize

- Use [kustomize](https://kustomize.io/) to management a base set of K8s objects and then have overlays per environment (production, canary, staging). This is much simpler than using Helm, with it's templates.

Try the commands in the next section from the demo app root and see the [kustomize example with base and overlays](https://github.com/BrianSigafoos/docker-rails-webpacker-app/tree/main/kubernetes).

- Make changes to a folder in /overlays or to the /base and then check the output manually:

### Kubernetes deployments manually

You'll only do these if you're making changes to the /kubernetes/base or overlays files. Once everything is set up, for app code changes you'll let Github Actions deploy for you in the next section.

```shell
# 1. Set env
K8S_ENV=canary
# K8S_ENV=prod (!! update SHA in step 2!!)

# 2. Set SHA
# Update newTag SHA in kubernetes/overlays/$K8S_ENV/kustomization.yaml

# 3. Check diff
k diff -k kubernetes/overlays/$K8S_ENV

# 4. Apply and watch
k apply -k kubernetes/overlays/$K8S_ENV --validate; kgpwide -w

# 5. Visit URL's to validate
# https://canary-deploy.<YOUR-APP-DOMAIN.com>

# 6. Check pod distribution and utilization on nodes
k resource-capacity --pods --util

# 7. Debug a running pod. Get pods: kgp; POD=...
keti $POD -- /bin/bash

# 8. Rollout history and rollback
# kubectl rollout history deployment/...
krh deployment/demo-app-canary
# kubectl rollout undo deployment/...
kru deployment/demo-app-canary
```

### Kubernetes debugging

This is essential when you're just getting started or making and K8s config changes.

```shell
# Be sure to read:
# https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application/
# https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/

# Get pod name
# kubectl get pod
kgp

# Set env vars
POD=$(kgp -o=jsonpath='{.items[0].metadata.name}')
CONTAINER=demoapp-container

# Describe the pod to target. Shows Events on that pod
# kubectl describe pod $POD
kdp $POD

# View logs
# kubectl logs
# kl $POD $CONTAINER
kl $POD
# If failed
# kl $POD $CONTAINER --previous
kl $POD --previous

# Get interactive shell into the pod for debugging
# kubectl exec --stdin --tty $POD -- /bin/bash
keti $POD -- /bin/bash

# Create temporary debug pod copied from running pod
# k debug $POD -it --image=ubuntu --share-processes --copy-to=app-debug

# Debug a container that fails to start
# https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/#copying-a-pod-while-changing-its-command
k debug $POD -it --copy-to=app-debug --container=$CONTAINER -- sh

k attach app-debug -c $CONTAINER -it

# Try running commands on container
# kubectl exec ${POD} -c ${CONTAINER} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
k exec $POD -c $CONTAINER --

# Clean up the debug pod
k delete pod app-debug
```

### Using Github Actions to deploy

- Add a Github Action "workflow" to release (build, then deploy)
  - Example: [.github/workflows/release_canary.yml](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/.github/workflows/release_canary.yml)

This is pretty simple overall. For the ["deploy" action](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/.github/actions/deploy/action.yml), it simply sets the "image" (SHA) to be deployed via `kustomize edit set image "${{inputs.image}}"` and then runs `kubectl apply -k kubernetes/overlays/${{ inputs.k8s_env }}` to use kustomize to apply the change.

Kubernetes itself then takes care of the rest.

### Sample deployment script

Add a simple script `/scripts/deploy_prod.sh` or `/scripts/deploy_canary.sh` to deploy the latest code.

```sh
#!/bin/bash
set -e

# Helper function to ask to confirm with y/n
confirm() {
    local PROMPT=$1
    [[ -z $PROMPT ]] && PROMPT="OK to continue?"
    local REPLY=
    while [[ ! $REPLY =~ ^[YyNn]$ ]]; do
        echo -n "$PROMPT (y/n) "
        read -r
    done
    # The result of this comparison is the return value of the function
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Stash work, checkout main, and pull latest
echo "Stashing work, checking out main/master, and pulling latest"
git stash push
git checkout main
git pull --rebase --autostash

CURRENT_SHA=$(git rev-parse --short HEAD)
if ! confirm "Deploy latest SHA ($CURRENT_SHA) to prod?"; then
  echo -n "Enter prod deploy SHA (e.g. $CURRENT_SHA) > "
  read -r DEPLOY_SHA
else
  DEPLOY_SHA=$CURRENT_SHA
fi

TAG_NAME=deploy/prod/$DEPLOY_SHA

if ! confirm "Confirm to deploy $DEPLOY_SHA to prod ($TAG_NAME)?"; then
  echo "Not deploying ❌"
  exit 1
else
  echo "Deploying... 🚀"
  git tag $TAG_NAME $DEPLOY_SHA
  git push origin --tags
fi

# Back to previous branch
echo "Checking out previous branch"
git checkout -
echo "If needed, run: git stash pop (gstp)"
```

### Rails in Kubernetes

#### Database migrations

Always check and use recommendations from [strong_migrations](https://github.com/ankane/strong_migrations#removing-a-column) for removing a column, and more.

Because of the way Kubernetes deployments roll out pods (your containerized app), one by one and removing the old version there can often be a state with 2 versions of your code running at once.

The best way I've seen (so far) to handle this is to have the database migration be triggered manually, post deploy. This is also known as: Deploy new code, then migrate.

Because ActiveRecord caches the database schema, you'll need to ignore columns and do a few more steps of code change + deploy.

Add column flow:

1. Write migration to add column AND tell ActiveRecord to ignore column: `self.ignored_columns = ['some_column']`
2. Deploy code
3. Run migration manually
4. Remove `ignored_columns` code
5. Deploy

Remove column flow:

1. Tell ActiveRecord to ignore column: `self.ignored_columns = ['some_column']`
2. Deploy code
3. Write migration to remove column
4. Deploy and run migration manually
5. Remove `ignored_columns` code
6. Deploy

### PUMA app server

We switched from Passenger to PUMA in production after exploring some options and it has worked perfectly.

- [PUMA in production for Rails](https://dev.to/anilmaurya/why-to-use-puma-in-production-for-your-rails-app-44ga)
  - [anilmaurya/puma-benchmark - determine Puma config](https://github.com/anilmaurya/puma-benchmark)
- [Gitlab migrate to Puma from Unicorn](https://about.gitlab.com/blog/2020/07/08/migrating-to-puma-on-gitlab/)
- [Puma docs: Kubernetes on Puma](https://github.com/puma/puma/blob/master/docs/kubernetes.md)

#### Sidekiq workers

Liveness probes are a great feature of K8s that will automatically replace any dead (non-responsive) containers with new ones. To get this working for a sidekiq worker container simply use this excellent gem: [sidekiq_alive](https://github.com/arturictus/sidekiq_alive)

More code examples in the [demo app](https://github.com/BrianSigafoos/docker-rails-webpacker-app/blob/main/kubernetes/base/deployment-sidekiq.yaml)

### Kubernetes security best practices

These were published as [NSA/CISA Kubernetes Hardening Guidance](https://www.nsa.gov/News-Features/Feature-Stories/Article-View/Article/2716980/nsa-cisa-release-kubernetes-hardening-guidance/)

A summary of the key recommendations from each section are:

- Kubernetes Pod security
  - [x] Use containers built to run applications as non-root users
  - [x] Where possible, run containers with immutable file systems
  - [ ] Scan container images for possible vulnerabilities or misconfigurations
  - [ ] Use a [Pod Security Policy (deprecated 1.21)](https://kubernetes.io/docs/concepts/policy/pod-security-policy/) -> [Pod Security admission controller (new 1.22)](https://kubernetes.io/docs/concepts/security/pod-security-admission/) to enforce a minimum level of security
        including:
    - [x] Preventing privileged containers
    - [ ] Denying container features frequently exploited to breakout, such
          as hostPID, hostIPC, hostNetwork, allowedHostPath
    - [x] Rejecting containers that execute as the root user or allow
          elevation to root
    - [ ] Hardening applications against exploitation using security services
          such as SELinux®, AppArmor®, and seccomp
- Network separation and hardening
  - [ ] Lock down access to control plane nodes using a firewall and role-based
        access control (RBAC)
  - [ ] Further limit access to the Kubernetes etcd server
  - [ ] Configure control plane components to use authenticated, encrypted
        communications using Transport Layer Security (TLS) certificates
  - [ ] Set up network policies to isolate resources. Pods and services in different
        namespaces can still communicate with each other unless additional
        separation is enforced, such as network policies
  - [ ] Place all credentials and sensitive information in Kubernetes Secrets
        rather than in configuration files. Encrypt Secrets using a strong
        encryption method
- Authentication and authorization
  - [ ] Disable anonymous login (enabled by default)
  - [ ] Use strong user authentication
  - [ ] Create RBAC policies to limit administrator, user, and service account
        activity
- Log auditing
  - [ ] Enable audit logging (disabled by default)

The [demo app](https://github.com/BrianSigafoos/docker-rails-webpacker-app) does the checked ones above and everyone really should. They're straightforward to implement.
See the Dockerfile for "nonroot" USER setup and USER_ID

The other parts are as simple as passing some options in the K8s Deployment spec

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
    - name: demoapp-container
      image: ghcr.io/briansigafoos/docker-rails-webpacker-app
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        runAsNonRoot: true
```

### Resources

- [How to use docker multi-stage build to create optimal images for dev and production](https://geshan.com.np/blog/2019/11/how-to-use-docker-multi-stage-build/)
- [Ruby on Whales: Dockerizing Ruby and Rails development](https://evilmartians.com/chronicles/ruby-on-whales-docker-for-ruby-rails-development)
- [Running a Rails app with Webpacker and Docker](https://medium.com/@dirkdk/running-a-rails-app-with-webpacker-and-docker-8d29153d3446)
- [Github Actions to deploy to K8s - Valikube Actions](https://github.com/ValiMail/valikube-actions)

## More Reading

- [Build images on GitHub Actions with Docker layer caching](https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching)
- [Deploying Rails 6 Assets with Docker and Kubernetes](https://blog.cloud66.com/deploying-rails-6-assets-with-docker/)
