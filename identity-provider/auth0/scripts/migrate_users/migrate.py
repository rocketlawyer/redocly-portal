import requests
import json
import logging
import os


# Configuration Values
DOMAIN = os.getenv('DOMAIN', 'rocketlawyer-developer-center.us.auth0.com')
AUDIENCE = f'https://{DOMAIN}/api/v2/'
CLIENT_ID = os.getenv('CLIENT_ID', 'kUvyIUhiTWQUH1RdAAi3Zg4ytI22Q5MR')
CLINET_SECRET = os.getenv('CLINET_SECRET', 'b-ev9RhWGXXD6gk_4vdZ0xflOYDPsLvwhLtUJDLmG3pNhjDavIKS_NQYfUuI2kgL')
CONNECTION = os.getenv('BASE_URL', 'redocly-dev-portal')
GRANT_TYPE = 'client_credentials'

logging.basicConfig(level=logging.DEBUG, format=logging.BASIC_FORMAT)
LOG = logging.getLogger(__name__)
     

def get_access_token():
 url = f"https://{DOMAIN}/oauth/token"
 payload =  { 
  'grant_type': GRANT_TYPE,
  'client_id': CLIENT_ID,
  'client_secret': CLINET_SECRET,
  'audience': AUDIENCE
 }
 headers = {
    'Authorization': 'Bearer {access_token}',
    'Content-Type': 'application/json'
 }
 response = requests.post(url,  data=payload)
 if(response.status_code == 200):
    LOG.info('Created access token')
    oauth = response.json()
    access_token = oauth.get('access_token')
    return access_token
 else:
    LOG.error(f'Error Creating Access Token {oauth}')




def send_invitations(access_token):
    if(access_token):
        with open('users.json') as f:
            data = json.load(f)
            for user in data['users']:
                LOG.info(f'Creating user {user["email"]}')
                created_user = create_user(user,access_token)
                if(created_user):
                    LOG.info(f'Created user {created_user["email"]}')
                    trigger_change_password_email(created_user["email"])
                else:   
                    LOG.error(f'Error creating user {user["email"]}')



def create_user(data, access_token):
    url = f"https://{DOMAIN}/api/v2/users"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.post(url, headers=headers,  json=data)
    if(response.status_code == 201):
        user = response.json()
        return user




def trigger_change_password_email(email):
    url = f"https://{DOMAIN}/dbconnections/change_password"
    payload =  { 
        'client_id': CLIENT_ID,
        'email': email,
        'connection': CONNECTION
    }
    response = requests.post(url, json=payload)
    if(response.status_code == 200):
        LOG.info(f'Invitation Email sent to  user {email}')
    else:
        LOG.info(f'Error sending invitation email to user {email}')


# ----
# Main
# ----
if __name__ == '__main__':
    access_token = get_access_token()
    send_invitations(access_token)

