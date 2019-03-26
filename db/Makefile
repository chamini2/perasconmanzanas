.PHONY: init
init:
	docker-compose up -d postgres

.PHONY: wait_postgres
wait_postgres: init
	docker-compose run --rm wait_postgres

.PHONY: migrate
migrate: wait_postgres
	sqitch deploy

.PHONY: test
test:
	docker-compose -f docker-compose.test.yml run --rm db_check

.PHONY: destroy
destroy:
	docker-compose down -v
	rm -rf data/
