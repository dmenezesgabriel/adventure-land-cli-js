build:
	time docker-compose build

run:
	docker-compose run --rm bot yarn run main

down:
	docker-compose down

sh:
	docker-compose run --rm bot
