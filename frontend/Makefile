config:
	rm -f src/config.tsx
	echo "class config { static PATH = \"https://api.costlycommute.me/\"; }; export default config;" > src/config.tsx # extra ugly hack

deps:
	yarn

build: deps config
	yarn run build

start:
	yarn start

test:
	CI=true npm test -- --coverage

wait-for-selenium:
	chmod +x wait-for-selenium.sh
	./wait-for-selenium.sh


e2e-deps:
	apt update
	apt install jq -yq
	pip install selenium

e2e: wait-for-selenium
	python guitests.py