docker_build:
	rm -rf node_contracts
	mkdir -p node_contracts
	cp -r ../squidward-node/libs/contracts/* node_contracts
	cd node_contracts && npm pack
	docker build --progress=plain -t squidwardproxy/squidward .
	rm -rf node_contracts

deploy:
	tsx ./shell/deploy.js

migration_create:
	@npm run migrations:create

migration_up:
	@npm run migrations:up

migration_down:
	@npm run migrations:down