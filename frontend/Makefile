.DEFAULT_GOAL := help
help:
	@echo "Available commands:"
	@echo
	@cat Makefile | grep '^\w.*:$$' | cut -d ':' -f 1 | grep -v '^help$$'

dev:
	yarn vite dev

preview:
	rm -rfv ./dist/*
	yarn vite build
	yarn vite preview 

build:
	yarn vite build

zip: build
	bash -c 'cd dist && zip -r ../dist.zip .'


clean:
	rm -rfv ./node_modules/
	rm -rfv ./yarn.lock
	rm -rfv ./package-lock.json
	yarn install

pretty:
	yarn prettier --write $$(find ./src -name '*.ts')
	yarn prettier --write $$(find ./src -name '*.vue')
	yarn prettier --write $$(find ./src -name '*.scss')
