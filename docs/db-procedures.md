# Migration
First, start the backend and database:

```
$ make devops
```

Once it's up at running, you should have a fresh database from `data_dump.sql`. Then, you'll need to get a shell into the backend container:

```
$ docker exec -ti phase1_backend_1 /bin/bash
```

The container names should always be the same. In the shell, you should run

```
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
```

This will transition the currently running database to the new models. If it complains about not being able to find a revision, install `postgresql-client` locally and drop the Alembic version table:

```
$ rm -rf migrations/
$ psql -h localhost -U postgres -c "drop table alembic_version"
```

...and then run the above migration commands again. Kill the shell, and open another one to the database container:

```
$ docker exec -ti phase1_db_1 /bin/bash
```

Then, use `pg_dump` to dump the new, migrated database to `data_dump.sql`.
```
$ pg_dump -h localhost -U postgres > backend/data_dump.sql
```
This will export the entire database to `data_dump.sql`, which is versioned. Then, kill your `make devops` and run `make restack`. After that,`make stack` should have the new schema, and once you've pushed to `dev`, everyone else will have the new, migrated database.

# Population
Populating the database from the scrapers is a miserable endeavor that no one (except me, because misery is my lot in life) should ever have to do again. However, the procedure is here for posterity to laugh at. First, migrate your database as above and ensure that your tables are in place. Then, you can start the DevOps stack:

```
$ make devops
```

and open a shell to the backend container.

```
$ docker exec -ti phase1_backend_1 /bin/bash
```

Once you're there, you can populate the `city` relation via

```
$ python scrape.py scrape-cities -p $POPULATION_LOWER_BOUND
```

where `$POPULATION_LOWER_BOUND` is the lower bound of the population of the cities you want to scrape. I used 100,000 on the first run, and that got me 314 cities. I'd not recommend any lower a bound. Please note that there is a blacklist of geocodes in `scrape_location.py` because our data source believes certain statistical and metropolitan areas are, in fact, cities, and when we fetch images and descriptions from Wikipedia, it tends to choke. If it breaks with a different population bound, consider blacklisting the geocode it choked on. You can run this as many times as you like; it won't create duplicate cities.

To populate the `housing` relation, simply run

```
$ python scrape.py scrape-houses
```

This will take absolutely forever to run and will burn as many Realtor.com API requests as you have cities. Don't run this twice, and use your own API key.

Once this is done, you can dump the database as above, and the newly-scraped data will persist across container orchestra restarts.