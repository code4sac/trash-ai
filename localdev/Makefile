down:
	docker-compose down

up: down
	docker-compose build
	docker-compose up --remove-orphans
	make down
