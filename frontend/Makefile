.DEFAULT_GOAL := help
help:
	@echo "Available commands:"
	@echo
	@cat Makefile | grep '^\w.*:$$' | cut -d ':' -f 1 | grep -v '^help$$'

dev:
	yarn vite \
		--port 5150 \
		--force \
		-l info

build:
	yarn vite build


clean:
	rm -rfv ./node_modules/
	rm -rfv ./yarn.lock
	rm -rfv ./package-lock.json
	yarn install

pretty:
	yarn prettier --write $$(find ./src -name '*.ts')
	yarn prettier --write $$(find ./src -name '*.vue')
