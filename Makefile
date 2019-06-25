COMPOSE_FILE=docker-compose.dev.yml

.PHONY: start
start: start_db start_api start_server

.PHONY: start_db
start_db:
	make -C db start

.PHONY: start_api
start_api: stop_api
	docker-compose -f $(COMPOSE_FILE) up --build -d api

.PHONY: start_server
start_server: stop_server
	docker-compose -f $(COMPOSE_FILE) up --build -d server


.PHONY: stop
stop: stop_server stop_api stop_db

.PHONY: stop_db
stop_db:
	make -C db stop

.PHONY: stop_api
stop_api:
	docker-compose -f $(COMPOSE_FILE) stop api

.PHONY: stop_server
stop_server:
	docker-compose -f $(COMPOSE_FILE) stop server


.PHONY: test
test:
	make -C db test

.PHONY: destroy
destroy:
	docker-compose -f $(COMPOSE_FILE) down -v
	rm -rf data/
