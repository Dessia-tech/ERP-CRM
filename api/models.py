#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Models connected to database with ponyorm
"""
import time

from api.core import app
from decimal import Decimal
import pony.orm

#from api import tasks

with app.app_context():
    if app.config['PONY_PROVIDER'] == 'sqlite':
        pony_db = pony.orm.Database('sqlite', app.config['PONY_DB_FILE'], create_db = True)
    else:
        pony_db = pony.orm.Database()
        pony_db.bind(provider=app.config['PONY_PROVIDER'], host=app.config['PONY_HOST'],
                 user=app.config['PONY_USER'], passwd=app.config['PONY_PASSWD'],
                 db=app.config['PONY_DB'])



class User(pony_db.Entity):
    password=pony.orm.Required(str,120)
    admin=pony.orm.Required(bool)
    active=pony.orm.Required(bool)
    
    first_name=pony.orm.Optional(str,40)
    last_name=pony.orm.Optional(str,40)
    phone_country=pony.orm.Optional(int)
    phone_number=pony.orm.Optional(int)
    email=pony.orm.Required(str,40,unique=True) 

    last_authentication=pony.orm.Required(int,default=0)
    meetings_attending = pony.orm.Set('Meeting')


    def to_dict(self,*args,**kwargs):
        d=pony_db.Entity.to_dict(self,*args,**kwargs)
        return d


class Organization(pony_db.Entity):
    name=pony.orm.Optional(str,40)
    contacts = pony.orm.Set('Contact')
    
    
class Contact(pony_db.Entity):
    first_name=pony.orm.Optional(str,40)
    last_name=pony.orm.Optional(str,40)
    phone_country=pony.orm.Optional(int)
    phone_number=pony.orm.Optional(int)
    email=pony.orm.Required(str,40,unique=True) 
    meetings_attending = pony.orm.Set('Meeting')

    organization = pony.orm.Optional('Organization')
    
class Meeting(pony_db.Entity):
    name = pony.orm.Optional(str, 40)
    place = pony.orm.Optional(str, 40)
    contact_participants = pony.orm.Set('Contact')
    users_participants = pony.orm.Set('User')
    
pony_db.generate_mapping(create_tables=True)

