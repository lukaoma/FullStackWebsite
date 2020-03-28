test: test-frontend test-backend

test-frontend:
	docker-compose -f docker-compose.test.frontend.yml up --exit-code-from frontend

test-e2e:
	docker-compose -f docker-compose.test.e2e.yml up --exit-code-from test-runner

test-backend:
	docker-compose -f docker-compose.test.backend.yml up --exit-code-from backend

deploy-frontend:
	cd frontend && make build

deploy-backend:
	cd backend && make deploy

stack: purge_db
	docker-compose up

devops:
	docker-compose -f docker-compose.dev.yml up

restack: clean purge_db
	docker-compose up --build

clean:
	rm -rf frontend/build
	rm -rf frontend/node_modules # speed improvement, believe it or not

purge_db:
	docker rm `docker ps -a -q` -f
	docker volume prune -f
	rm -rf  backend/migrations