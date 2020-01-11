# !bin/sh
cd python-example
pipenv shell
uvicorn --port=8080 gql:app 