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

list:
	bash -c "cd ./infra && cdk list"

diff:
	bash -c "cd ./infra && cdk diff"
