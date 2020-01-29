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


def is_valid_event(event):
    is_valid, error_msg = validate(event)
    print("error_msg:"+error_msg)
    if is_valid is False:
        return False, error_msg
    else:
        return True, "your schema is valid!"
