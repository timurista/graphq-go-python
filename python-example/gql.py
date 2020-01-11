from ariadne import ObjectType, QueryType, gql, make_executable_schema
from ariadne.asgi import GraphQL
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.applications import Starlette


# Define types using Schema Definition Language (https://graphql.org/learn/schema/)
# Wrapping string in gql function provides validation and better error traceback
type_defs = gql("""
    type Query {
        people: [Person!]!
    }

    type Person {
        firstName: String
        lastName: String
        age: Int
        fullName: String
    }
""")

# Map resolver functions to Query fields using QueryType
query = QueryType()

# Resolvers are simple python functions
@query.field("people")
def resolve_people(*_):
    return [
        {"firstName": "John", "lastName": "Doe", "age": 21},
        {"firstName": "Bob", "lastName": "Boberson", "age": 24},
    ]


# Map resolver functions to custom type fields using ObjectType
person = ObjectType("Person")

@person.field("fullName")
def resolve_person_fullname(person, *_):
    return "%s %s" % (person["firstName"], person["lastName"])

# Create executable GraphQL schema
schema = make_executable_schema(type_defs, query, person)


middleware = [
    Middleware(CORSMiddleware, 
        allow_origins=["*"],
        allow_headers=["*"],
        allow_methods=["*"],
        expose_headers=["*"],
        allow_credentials=True,
    )
]

# Create an ASGI app using the schema, running in debug mode
# app = CORSMiddleware((GraphQL(schema, debug=True, middleware=middleware))
app = Starlette(debug=True, middleware=middleware)
app.mount("/graphql", GraphQL(schema, debug=True))


# app = Starlette(routes=routes, middleware=middleware)

# app.add_url_rule('/graphql', view_func=GraphQlView.as_view('graphql'))`