config:
	rm -f .env
	AWS_ACCESS_KEY_ID=${EB_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${EB_SECRET_ACCESS_KEY} aws s3 cp s3://costlycommute-config/.env .

deps:
	rm -rf migrations
	apt update
	apt install postgresql-client -y
	pip3 install -r requirements.txt

deps-prod:
	pip3 install -r requirements.txt

build: deps-prod config

wait-for-db:
	chmod +x wait-for-db.sh
	./wait-for-db.sh

reload-db: wait-for-db #init-db
	psql -h ${DB_HOST} -U ${DB_USER} -f data_dump.sql 

init-db: wait-for-db
	rm -rf migrations
	python manage.py db init
	python manage.py db migrate
	python manage.py db upgrade

start: reload-db 
	flask run --host=0.0.0.0

test: reload-db
	flask run --host=0.0.0.0 &
	python3 test.py

deploy: build
	AWS_ACCESS_KEY_ID=${EB_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${EB_SECRET_ACCESS_KEY} eb init
	AWS_ACCESS_KEY_ID=${EB_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${EB_SECRET_ACCESS_KEY} eb deploy flask-env