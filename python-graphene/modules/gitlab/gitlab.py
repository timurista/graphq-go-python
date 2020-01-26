import os
import graphene
import gitlab
from promise import Promise
from promise.dataloader import DataLoader

token = os.environ.get("GITLAB_TOKEN")
gl = gitlab.Gitlab("https://gitlab.eng.roku.com", private_token="gdfG9iSimmLUTWzrqwVg")


class Pipeline(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()


# enable functions from the builder
# https://gitlab.eng.roku.com/web/deployboard


class Gitlab(DataLoader):
    def batch_load_fn(self, keys=""):
        return Promise.resolve([gl.projects.get(key) for key in keys])


# class Gitlab(graphene.Object):


if __name__ == "__main__":
    Gitlab().pipelines()
