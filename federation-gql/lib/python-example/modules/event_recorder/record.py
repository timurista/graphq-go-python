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
from .validator import is_valid_event
import uuid
import time
# from jsonschema import validators, Draft4Validator, FormatChecker
# from jsonschema.exceptions import ValidationError


def make_er_event(event):
    er_event = copy(event)
    er_event['id'] = uuid.uuid4()
    er_event['timestamp'] = time.time()
    return er_event


def record(event):
    session = boto3.session.Session()
    credentials = session.get_credentials().get_frozen_credentials()
    region = "us-west-2"
    service = 'es'
    auth = AWSV4Sign(credentials, region, service)
    is_valid, error_msg = is_valid_event(event)

    if is_valid is False:
        return False, error_msg

    try:
        er_event = make_er_event(event)
        return True, f"your event: {er_event}"
    except Exception as e:
        raise e
