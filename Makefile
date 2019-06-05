.PHONY: start
start: start_db start_api start_server

.PHONY: start_db
start_db:
	make -C db start

.PHONY: start_api
start_api: stop_api
	docker-compose up --build -d api

.PHONY: start_server
start_server: stop_server
	docker-compose up -d server


.PHONY: stop
stop: stop_server stop_api stop_db

.PHONY: stop_db
stop_db:
	make -C db stop

.PHONY: stop_api
stop_api:
	docker-compose stop api

.PHONY: stop_server
stop_server:
	docker-compose stop server


.PHONY: test
test:
	make -C db test

.PHONY: destroy
destroy:
	docker-compose down -v
	rm -rf data/
