.DEFAULT_GOAL := help
help:
	@echo "Available commands:"
	@cat Makefile | grep '^\w' | cut -d ':' -f 1 | grep -v '^help$$'




STAGE := $(shell git rev-parse --abbrev-ref HEAD | sed 's/^aws\///')
REGION := us-west-1
export STAGE
export REGION

offline:
	yarn run local

deploy:
	serverless deploy \
		-s "${STAGE}" \
		-r "${REGION}"

destroy:
	serverless remove \
		-s "${STAGE}" \
		-r "${REGION}"

print:
	serverless print \
		-s "${STAGE}" \
		-r "${REGION}"

list:
	serverless deploy list functions \
		-s "${STAGE}" \
		-r "${REGION}"

logs_web:
	serverless logs \
		--function webapp \
		-t \
		-s "${STAGE}" \
		-r "${REGION}"
#
# logs_rate:
#     serverless logs \
#         --function ratehandler \
#         -t \
#         -s "${STAGE}" \
#         -r "${REGION}"
#
# logs_cron:
#     serverless logs \
#         --function cronhandler \
#         -t \
#         -s "${STAGE}" \
#         -r "${REGION}"
