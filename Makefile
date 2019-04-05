.PHONY: start
start: db_start api_start server_start

.PHONY: db_start
db_start:
	make -C db start

.PHONY: api_start
api_start: api_stop
	docker-compose up --build -d api

.PHONY: server_start
server_start: server_stop
	docker-compose up -d server

.PHONY: stop
stop: server_stop api_stop db_stop

.PHONY: db_stop
db_stop:
	make -C db stop

.PHONY: api_stop
api_stop:
	docker-compose stop api

.PHONY: server_stop
server_stop:
	docker-compose stop server


.PHONY: test
test:
	make -C db test

.PHONY: destroy
destroy:
	docker-compose down -v
	rm -rf data/
