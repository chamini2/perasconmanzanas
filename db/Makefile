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

.PHONY: revert_schema
revert_schema:
	sqitch revert -f sqitch.plan -y

.PHONY: revert_access
revert_access:
	sqitch revert -f access.plan -y

.PHONY: deploy_schema
deploy_schema:
	sqitch deploy -f sqitch.plan

.PHONY: deploy_access
deploy_access:
	sqitch deploy -f access.plan

.PHONY: deploy
deploy: deploy_schema deploy_access

.PHONY: revert
revert: revert_access revert_schema

.PHONY: rebase
rebase: revert deploy

.PHONY: rebase_access
rebase_access: revert_access deploy_access
