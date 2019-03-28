.PHONY: init
init:
	docker-compose up -d db

.PHONY: wait_db
wait_db: init
	docker-compose run --rm wait_db

.PHONY: migrate
migrate: wait_db
	sqitch -C db deploy

.PHONY: test
test:
	docker-compose -f docker-compose.test.yml run --rm db_test

.PHONY: destroy
destroy:
	docker-compose down -v
	rm -rf data/
