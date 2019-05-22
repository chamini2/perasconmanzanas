COMPOSE_FILE=../docker-compose.yml

.PHONY: init
init:
	docker-compose -f $(COMPOSE_FILE) up -d db

.PHONY: start
start: init
	docker-compose -f $(COMPOSE_FILE) run --rm wait_db

.PHONY: stop
stop:
	docker-compose -f $(COMPOSE_FILE) stop db

.PHONY: test
test:
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.test.yml run --rm db_test

.PHONY: revert
revert:
	sqitch revert -f access.plan -y
	sqitch revert -f sqitch.plan -y

.PHONY: deploy
deploy:
	sqitch deploy -f sqitch.plan
	sqitch deploy -f access.plan

.PHONY: rebase
rebase: revert deploy
