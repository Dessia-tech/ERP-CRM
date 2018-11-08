#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""

"""

from flask import Flask

from flask_bcrypt import Bcrypt, generate_password_hash
from flask_cors import CORS, cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


app = Flask(__name__)

cors = CORS(app)

app.config.from_pyfile('../config-prod.cfg')

if app.config['DEBUG']:
    print('### DEBUG MODE ###')
    app.config.from_pyfile('../config-dev.cfg')
    

# Add-ons to app
flask_bcrypt = Bcrypt(app)

#app.config['CORS_HEADERS'] = 'Content-Type'

limiter = Limiter(app,key_func=get_remote_address,default_limits=["2000 per day", "300 per hour"])

from itsdangerous import URLSafeTimedSerializer

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])


def confirm_token(token, expiration=360000):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token,salt=app.config['SECURITY_PASSWORD_SALT'],max_age=expiration)
    except:
        return False
    return email

# Email sending 
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText



def send_mail(recipient,subject,body):
    msg = MIMEMultipart()
    msg['From'] = app.config['EMAIL_SENDER']
    msg['To'] = recipient
    msg['Subject'] = subject
    message = body
    msg.attach(MIMEText(message))
    mailserver = smtplib.SMTP(app.config['SMTP_URL'], app.config['SMTP_PORT'])
    mailserver.ehlo()
    mailserver.starttls()
    mailserver.ehlo()
    mailserver.login(app.config['SMTP_USER'], app.config['SMTP_USER'])
    mailserver.sendmail(app.config['EMAIL_SENDER'], recipient, msg.as_string())
    mailserver.quit()


from api import routes

if app.config['DEBUG']:
    from api import models
    with models.pony.orm.db_session:
        admin = models.User.get(email='admin@root.tld')
        if admin is None:
            print(generate_password_hash('admin').decode("utf-8"))
            admin = models.User(email='admin@root.tld', password=generate_password_hash('admin').decode("utf-8") , active=True, admin=True)
            models.pony.orm.commit()


