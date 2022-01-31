GIT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
IMAGE = trash_ai_bs

ifeq ($(GIT_BRANCH),local)
	export BOOT_PROFILE = localstack
	export STAGE = local
else
	export BOOT_PROFILE = personal
	export STAGE = $(GIT_BRANCH)
endif

local:
	bash -c "cd ./localdev && make up"

build:
	docker-compose -f ./localdev/docker-compose.build.yml build

list:
	bash -c "cd ./infra && cdk list"

diff:
	bash -c "cd ./infra && cdk diff"

github_role_update:
	bash -c "cd ./infra && cdk deploy trash-ai-github"

frontend_update:
	rm -rfv /tmp/asset-output/*
	bash -c "cd ./infra && cdk deploy trash-ai-us-west-2-shollingsworth-staging-frontend"
