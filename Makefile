build-%:
	time docker-compose -f docker-compose-$(*).yml build

run-%:
	docker-compose -f docker-compose-$(*).yml run --rm $(*) npm run main

down-%:
	docker-compose -f docker-compose-$(*).yml down
