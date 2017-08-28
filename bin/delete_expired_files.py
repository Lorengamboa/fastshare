#!/usr/bin/python

import sys
import os.path as path
import shutil
from datetime import datetime, timedelta
from pymongo import MongoClient


DAYS_AGO = 0 #Last time it was uploaded

#opening mongodb pool connection
client = MongoClient()
db = client.weshare
uploads = db.uploads
users = db.users

def main():

    #reads the last uploads that have pass the 5 days expiration time
    expired_uploads = uploads.find({'createdAt' :{
        '$lt':   datetime.now() - timedelta(days=DAYS_AGO)    }
    })

    #reads the result cursor
    path_uploads =  path.abspath(path.join(__file__ ,"../../uploads"))

    for doc in expired_uploads:
       try:
           uploads.remove({'createdAt' :{'$lt':   datetime.now() - timedelta(days=DAYS_AGO)    }})
           users.update({'_id': doc['owner']},{'$pull': {'uploads': doc['_id']}})
           shutil.rmtree(path_uploads+'/'+doc['query'])
       except:
            print("Unexpected error:", sys.exc_info())
            sys.stdout.flush()

    client.close() #closes mongodb connection

#start process
if __name__ == '__main__':
    main()
