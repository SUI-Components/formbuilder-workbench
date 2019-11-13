OWNER=Carlos Villuendas <carlos.villuendas@schibsted.com>

SHELL := /bin/bash

export NODE_ENV ?= production
SUBDOMAIN ?= form-builder-workbench
export CDN ?= https://$(SUBDOMAIN).surge.sh/

.PHONY: spa deploy lint help
.DEFAULT_GOAL := help

spa: ## Build a local spa
	npx sui-bundler build -C


deploy: lint spa ## Deploy the SPA to Surge.sh
	surge -d $(CDN) ./public

lint: ## Lint js and sass app
	npx sui-lint js --fix
	npx sui-lint sass --fix

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
