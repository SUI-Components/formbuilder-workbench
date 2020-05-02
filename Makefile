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

release:
	git pull
	git config --global user.email "carlosvillu@gmail.com"
	git config --global user.name "carlosvillu"
	git remote rm origin
	git remote add origin https://carlosvillu:${GH_TOKEN}@github.com/SUI-Components/formbuilder-workbench.git > /dev/null 2>&1
	git checkout master
	git pull origin master
	rm -Rf package-lock.js
	npm install --only pro --package-lock-only --prefer-online --package-lock --progress false --loglevel error --no-bin-links --ignore-scripts --no-audit
	npm install --only=dev --package-lock-only --prefer-online --package-lock --progress false --loglevel error --no-bin-links --ignore-scripts --no-audit
	git add package-lock.json
	npx sui-mono release

lint: ## Lint js and sass app
	npx sui-lint js --fix
	npx sui-lint sass --fix

help: ## show help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
