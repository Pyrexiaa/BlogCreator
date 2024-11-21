from jamaibase import JamAI, protocol as p
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('JAMAI_API_KEY')
project_id = os.getenv('JAMAI_PROJECT_ID')

jamai = JamAI(api_key=api_key, project_id=project_id)