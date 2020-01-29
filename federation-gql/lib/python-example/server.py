import graphene
from fastapi import FastAPI

# using this for a nice apollo-like playground
from graphene_prisma.starlette import GraphQLApp
from graphene_federation import build_schema, key
from modules.event_recorder.record import record
import json
# from modules.gitlab.gitlab import Gitlab, Pipeline

# gl = Gitlab()


class Query(graphene.ObjectType):
    # gitlab = Gitlab
    # web_pipelines = graphene.List(lambda: Pipeline)
    hello = graphene.String;

    def resolve_hello(self, info):
        return "hello from python"


class EventRecorderMutation(graphene.Mutation):
    class Arguments:
        # The input arguments for this mutation
        json_event = graphene.String(required=True)

    # The class attributes define the response of the mutation
    # question = graphene.Field(QuestionType)
    ok = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, json_event):
        event = json.loads(json_event)
        ok, message = record(event)
        return EventRecorderMutation(ok=ok, message=message)


# TODO:
# https://github.com/hasura/graphql-serverless/blob/master/aws-python/graphene-sqlalchemy/main.py

# Must name this mutation
class Mutation(graphene.ObjectType):
    test_event_recorder = EventRecorderMutation.Field()


schema = build_schema(Query, mutation=Mutation)
app = FastAPI()
app.add_route("/", GraphQLApp(schema=schema))
