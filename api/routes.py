#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Flask routes
"""

from api.core import app, limiter, generate_confirmation_token, confirm_token, send_mail
from flask import request,Response, send_file, current_app, g
from api import models

from flask_jwt import JWT, jwt_required, current_identity

from functools import wraps
#import tempfile

import json
#import jsonpickle
import jsonpickle.ext.numpy as jsonpickle_numpy
jsonpickle_numpy.register_handlers()

import pony.orm

from flask_bcrypt import check_password_hash, generate_password_hash

#from math import floor
import time
#import random
#import string
#import io
from datetime import datetime, timedelta
from zxcvbn import zxcvbn

import dns.resolver
import re

from flask_expects_json import expects_json


@pony.orm.db_session
def authenticate(email, password):
    user = models.User.get(email=email)
    if user:
        if check_password_hash(user.password, password.encode('utf-8')):
            user.last_authentication=int(time.time())
            return user

@pony.orm.db_session
def identity(payload):
    user_id = int(payload['id'])
    return models.User[user_id]

jwt = JWT(app, authenticate, identity)

def make_payload(identity):
    iat = datetime.utcnow()
    exp = iat + current_app.config.get('JWT_EXPIRATION_DELTA')
    nbf = iat + current_app.config.get('JWT_NOT_BEFORE_DELTA')
    return {'exp': exp, 'iat': iat, 'nbf': nbf, 'id': identity.id}

jwt.jwt_payload_handler(make_payload)


# Route limiter exempts
def is_admin():
    try:
        return current_identity.admin
    except AttributeError:
        return False

# Routes custom decorators
def active_user_required(function):
    doc='Requires to be authentified as an active user'
    if function.__doc__:
        function.__doc__+=doc
    else:
        function.__doc__=doc
    @wraps(function)
    def active_user_function(*args,**kwargs):
        if current_identity.active:
            return function(*args,**kwargs)
        else:
            return 'User is disactivated',401
    return active_user_function

def admin_user_required(function):
    doc='Requires to be authentified as an admin user'
    if function.__doc__:
        function.__doc__+=doc
    else:
        function.__doc__=doc
    @wraps(function)
    def admin_user_function(*args,**kwargs):
        if current_identity.admin:
            return function(*args,**kwargs)
        else:
            return 'User has not admin rights',401
    return admin_user_function


@app.errorhandler(404)
def page_not_found(e):
    return 'Endpoint Not Found', 404

@app.route('/')
def index():
    return 'API index'


 

###########################################################
#                    Account Tasks
###########################################################

@app.route('/account/infos',methods=['GET'])
@jwt_required()
def MyInfos():
    """
    Returns info on account
    """
    d=current_identity.to_dict(exclude=['password'])
    return json.dumps(d)


@app.route('/account/infos/update',methods=['POST'])
@jwt_required()
@pony.orm.db_session
def UpdateMyInfos():
    """
    update infos on account
    """
    j=request.get_json()
    current_user=models.User[current_identity.id]
    for attr in ['first_name','last_name','phone_country','phone_number']:
        if attr in j:
            setattr(current_user,attr,j[attr])
    pony.orm.commit()
    return json.dumps({'message':'User updated'})

    
@app.route('/account/password/update',methods=['POST'])
@jwt_required()
@pony.orm.db_session
def UpdatePassword():
    """
    update infos on account
    """
    j=request.get_json()
    current_user=models.User[current_identity.id]
    if 'current_password' in j:
        current_password=j['current_password']
    else:
        return 'Missing current password',400
    if 'new_password' in j:
        new_password=j['new_password']
    else:
        return json.dumps({'message':'Missing new password'}),400

    password_test=zxcvbn(new_password)
    if password_test['score']<3:
        return json.dumps({'message':password_test['feedback']['warning']+' '+''.join(password_test['feedback']['suggestions'])}),422

    if check_password_hash(current_user.password, current_password):
        enc_password=generate_password_hash(new_password).decode("utf-8") 
        current_user.password=enc_password
        pony.orm.commit()
        return json.dumps({'message':'Password updated'})
    else:
        return json.dumps({'message':'Bad current password'}),403


@limiter.limit("20/day",exempt_when=is_admin)
@app.route('/users/create',methods=['POST'])
@pony.orm.db_session
def RegisterUser():
    d=request.get_json()
    try:
        email=d['email']
        password=d['password']
    except KeyError:
        return 'Missing fields in request form',400
   
    # Test password
    password_test=zxcvbn(password)
    if password_test['score']<3:
        return json.dumps({'message':password_test['feedback']['warning']+' '+''.join(password_test['feedback']['suggestions'])}),422

    if 'first_name' in d:
        first_name=d['first_name']
    else:
        first_name=''
    if 'last_name' in d:
        last_name=d['last_name']
    else:
        last_name=''

    # See if email is valid
    valid_email=False
    if re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', email) is not None:
        email_user,email_domain=email.split('@')
        try:
            dns.resolver.query(email_domain,'MX')
            valid_email=True
        except dns.resolver.NXDOMAIN:
            pass
    if valid_email:
        if pony.orm.exists(u for u in models.User if u.email==email):
            return 'Conflict, a user already exist with same email',409  
        enc_password=generate_password_hash(password).decode("utf-8") 
        user=models.User(email=email,password=enc_password,first_name=first_name,last_name=last_name,admin=False,active=False,balance=0.,organization_role=0)
        pony.orm.commit()
        resp=Response(json.dumps({'user_id':user.id}),status=201)
        resp.headers['Location']='/users/{}'.format(user.id)
        subject="Activate your ERP-CRM account"
        body="""Hello,\n\nYou successfully registered to ERP-CRM!\n\nYour account isn't activated yet, please follow this link to activate it:\n /account?email_verification_token={}\nYou will be asked first to login with your credentials.\n""".format(generate_confirmation_token(user.email))
        send_mail(email,subject,body)
        return resp
#        else:
#            
    else:
        return 'Email is not valid',400


@limiter.limit("1000/day")
@app.route('/account/verify-email',methods=['POST'])
@pony.orm.db_session
def VerifyEmail():
    d=request.get_json()
    try:
        token=d['token']
    except KeyError:
        return 'Bad form fields in request',400
    email=confirm_token(token)
    if email:
        user=models.User.get(email=email)
        if user:
            user.active=True
            pony.orm.commit()
        return json.dumps({'message':'User activated'}),200 
    return 'Invalid token!',403

@limiter.limit("3/day")
@app.route('/account/password/reset-email',methods=['POST'])
@pony.orm.db_session
def ResetEmailPassword():
    d=request.get_json()
    try:
        email=d['email']
    except KeyError:
        return 'Bad form fields in request',400
    user=models.User.get(email=email)
    if user:
        token=generate_confirmation_token(email)
        subject='Password reset'
        body="Hello,\n\nA password reset request was sent for your account.\nIf you want to reset your password follow this link:\n /account/password-reset/token={}\n\nIf you didn't ask a password reset, just ignore this email and delete it.\n\n-- \n".format(token)
        send_mail(email,subject,body)
        return json.dumps({'message':'Email sent'}),200 
    return 'No user found',404


@limiter.limit("20/day")
@app.route('/account/password/reset',methods=['POST'])
@pony.orm.db_session
def ResetPassword():
    d=request.get_json()
    try:
        token=d['token']
        new_password=d['new_password']
    except KeyError:
        return 'Bad form fields in request',400
    
    password_test=zxcvbn(new_password)
    if password_test['score'] < 3:
        return json.dumps({'message':password_test['feedback']['warning']+' '+''.join(password_test['feedback']['suggestions'])}),422

    email=confirm_token(token)
    user=models.User.get(email=email)
    if user:
        enc_password=generate_password_hash(new_password).decode("utf-8") 
        user.password = enc_password
        pony.orm.commit()
        return json.dumps({'message':'Password reset'}),200 
    return 'No user found',404
 


# =============================================================================
#  Organizations
# =============================================================================

# =============================================================================
# Admin
# =============================================================================


# =============================================================================
#  Contacts
# =============================================================================

@limiter.limit("2000/day")
@app.route('/contacts',methods=['GET'])
@jwt_required()
@pony.orm.db_session
def ListContacts():
    contacts = models.Contact.select().order_by(pony.orm.desc(models.Contact.last_name))
    return json.dumps([c.to_dict() for c in contacts])

add_contact_schema = {
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

@limiter.limit("2000/day")
@app.route('/contacts/create',methods=['POST'])
@jwt_required()
@pony.orm.db_session
@expects_json(add_contact_schema)
def CreateContact():
    if pony.orm.exists(c for c in models.Contact if c.email == g.data['email']):
        return json.dumps({'message': 'Contact with this email already exist'}), 409
    
    models.Contact(**g.data)
    pony.orm.commit()
    return json.dumps({'message': 'User added'}), 201


# =============================================================================
# Test
# =============================================================================

@app.route('/test')
def Test():
    return json.dumps({'message':'this is a test'})

#@app.route('/test/populate-db')
#@pony.orm.db_session
#def PopulateDB():
#    # This route should not be used in prod
#    if app.config['DEBUG']:
#        User[1]
#        return json.dumps({'message':'this is a test'})