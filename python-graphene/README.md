## Graphql federation

using graphene with federation and having a node js gateway handle requests

`https://github.com/preply/graphene-federation`

This blog was also very influencial for steps in python implementation:
https://medium.com/preply-engineering/apollo-federation-support-in-graphene-761a0512456d

# Manual integration steps in microservice development

add keys, extend, and id

- `@key(fields='id')` Determines that FileNode can be referenced from other services.
- `@extend(fields='id')` Marks FileNode as external. We can add more fields to it if needed.
- `id=external(graphene.Int(required=True))` Marks id as an external field.
- `build_schema` does all magic
  - it adds \_service and \_entities fields and resolvers in the schema
  - it has the same signature as graphene.Schema
