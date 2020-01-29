import boto3
import json
#import requests
from botocore.vendored import requests
#from requests_aws4auth import AWS4Auth
from requests_aws_sign import AWSV4Sign
from elasticsearch import Elasticsearch, RequestsHttpConnection, TransportError
import os
from datetime import datetime
import random
import traceback
# from jsonschema import validators, Draft4Validator, FormatChecker
# from jsonschema.exceptions import ValidationError


def validate(event):
    try:
        if not 'code-version' in event:
            return False, "code-version is not present"
        if not 'git-hash-code' in event:
            return False, "git-hash-code is not present"
        if not 'deploy-job-number' in event:
            return False, "deploy-job-number is not present"
        if not 'deploy-job-name' in event:
            return False, "deploy-job-name is not present"
        if not 'service-team' in event:
            return False, "service-team is not present"
        if not 'service-name' in event:
            return False, "service-name is not present"
        if not 'service-environment' in event:
            return False, "service-environment is not present"
        if not 'AWS-account' in event:
            return False, "aws-account is not present"
        if not 'AWS-region' in event:
            return False, "aws-region is not present"
        if not 'deploy-complete-time' in event:
            return False, "deploy-complete-time is not present"
        if not 'docker-tag' in event:
            return False, "docker-tag is not present"
        if not 'event_type' in event:
            return False, "event_type is not present"
        if not 'userID' in event:
            return False, "userID is not present"
        if not 'deploy-completion-status' in event:
            return False, "deploy-completion-status is not present"
        if not 'tracker-id' in event:
            return False, "tracker-id is not present"
        return True, "validation succeeded"
    except KeyError as e:
        raise AttributeError("Key {} is not found".format(e.message))


def record(event):
    session = boto3.session.Session()
    credentials = session.get_credentials().get_frozen_credentials()
    region = "us-west-2"
    service = 'es'
    auth = AWSV4Sign(credentials, region, service)
    is_valid, error_msg = validate(event)
    print("error_msg:"+error_msg)
    if is_valid is False:
        return False, error_msg
    else:
        return True, "success"
    #     return {
    #         'statusCode': 409,
    #         'headers': {'Content-Type': 'application/json'},
    #         'body': error_msg
    #     }
    # try:
    #     es_host = "vpc-eventrecorder-elk-rshxah6vr6y5whg3bgxmbgth4m.us-west-2.es.amazonaws.com"
    #     es_index = "{}-{}".format(os.environ['ES_INDEX'],
    #                               datetime.now().strftime("%Y%m"))
    #     event_dict = {}

    #     if isinstance(event['body'], str):
    #         event_dict = json.loads(event['body'])

    #     # add timestamp to event
    #     event_dict['timestamp'] = datetime.now().isoformat()
    #     # get the dict object's _id
    #     id = event_dict["docker-tag"]
    #     client = Elasticsearch(host=es_host, port=443, scheme="https", connection_class=RequestsHttpConnection,
    #                            http_auth=auth, use_ssl=True, verify_ssl=True)

    #     if client.indices.exists(index=es_index):
    #         client.index(index=es_index, doc_type='json', id=id +
    #                      '-' + str(random.randint(0, 1000)),  body=event_dict)
    #         print("index existed")
    #         return {
    #             'statusCode': 200,
    #             'headers': {'Content-Type': 'application/json'},
    #             'body': json.dumps(event_dict)

    #         }
    #     else:
    #         client.create(index=es_index, doc_type='json', id=id +
    #                       '-' + str(random.randint(0, 1000)), body=event_dict)
    #         print("new index")
    #         return {
    #             'statusCode': 200,
    #             'headers': {'Content-Type': 'application/json'},
    #             'body': json.dumps(event_dict)

    #         }
    # except Exception as e:
    #     traceback.print_stack()
    #     print("error_msg:"+str(e))
    #     return {
    #         'statusCode': 500,
    #         'headers': {'Content-Type': 'application/json'},
    #         'body': str(e)
    #         # 'body': event
    #     }
