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
    
#    def Dict(self, related_objects=True):
#        d = 


class Organization(pony_db.Entity):
    json_schema = {
        'type': 'object',
        'properties': {
            'name': {'type': 'string'},
        },
        'required': ['name']
    }
    
    
    name=pony.orm.Optional(str,40)
    contacts = pony.orm.Set('Contact')
    
    def AddContact(self, organization):
        self.contacts.add(organization)
        pony.orm.commit()
    
    def Dict(self, related_objects=True):
        d = {'id': self.id, 'name': self.name}
        if related_objects:
            contacts = [c.Dict(related_objects=False) for c in self.contacts]
        else:
            contacts = [c.id for c in self.contacts]
        d['contacts'] = contacts
        return d
    
class Contact(pony_db.Entity):
    json_schema = {
        'type': 'object',
        'properties': {
            'first_name': {'type': 'string'},
            'last_name': {'type': 'string'},
            'phone_country': {'type': 'integer'},
            'phone_number': {'type': 'integer'},
            'email': {'type': 'string'},
        },
        'required': ['email']
    }
    
    first_name = pony.orm.Optional(str,40)
    last_name = pony.orm.Optional(str,40)
    phone_country = pony.orm.Optional(int)
    phone_number = pony.orm.Optional(int)
    email = pony.orm.Required(str,40,unique=True) 
    meetings_attending = pony.orm.Set('Meeting')

    organization = pony.orm.Optional('Organization')
    
    def Dict(self, related_objects=True):
        d = {'id': self.id,
             'first_name': self.first_name,
             'last_name': self.last_name,
             'full_name': '{} {}'.format(self.first_name, self.last_name),
             'phone_country': self.phone_country,
             'phone_number': self.phone_number,
             'email': self.email}

        if self.organization is not None:     
            if related_objects:
                d['organization'] = self.organization.Dict(related_objects=False)
            else:
                d['organization'] = self.organization.id
        else:
            d['organization'] = None
        return d
    
class Meeting(pony_db.Entity):
    json_schema = {
        'type': 'object',
        'properties': {
            'name': {'type': 'string'},
            'place': {'type': 'string'},
            'start_date': {'type': 'integer'},
            'end_date': {'type': 'integer'},
            'contacts': {'type': 'array', "items": {"type": "number"}},
        },
        'required': ['name', 'contact_participants']
    }
    
    name = pony.orm.Optional(str, 40)
    place = pony.orm.Optional(str, 40)
    contact_participants = pony.orm.Set('Contact')
    users_participants = pony.orm.Set('User')
    start_date = pony.orm.Optional(int, size=64)
    end_date = pony.orm.Optional(int, size=64)
    report = pony.orm.Optional(str)
    
    @pony.orm.db_session
    def Update(self, update_dict):
        # Transforming contacts id in objects
        if 'contact_participants' in update_dict:
            contact_participants = []
            for contact_id in update_dict['contact_participants']:
                contact = Contact[int(contact_id)]
                if not contact:
                    return False
                contact_participants.append(contact)

            for contact in self.contact_participants:
                if not contact in contact_participants:
                    self.contact_participants.remove(contact)
            for contact in contact_participants:
                if not contact in self.contact_participants:
                    self.contact_participants.add(contact)
            
#            update_dict['contact_participants'] = contact_participants
            
        for k, v in update_dict.items():
            if k in ['name', 'place', 'contacts', 'start_date', 'end_date', 'report']:
                setattr(self, k, v)
        pony.orm.commit()
        return True
    
    def Dict(self):
        d = {'id': self.id,
                'name': self.name,
                'start_date': self.start_date,
                'end_date': self.end_date,
                'report': self.report}
        contact_participants = [c.Dict(related_objects=False) for c in self.contact_participants]
        d['contact_participants'] = contact_participants
        return d
        
    
pony_db.generate_mapping(create_tables=True)

