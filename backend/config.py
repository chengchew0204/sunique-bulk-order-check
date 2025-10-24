import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # SharePoint Configuration
    SHAREPOINT_TENANT_ID = os.getenv('SHAREPOINT_TENANT_ID')
    SHAREPOINT_CLIENT_ID = os.getenv('SHAREPOINT_CLIENT_ID')
    SHAREPOINT_CLIENT_SECRET = os.getenv('SHAREPOINT_CLIENT_SECRET')
    SHAREPOINT_OBJECT_ID = os.getenv('SHAREPOINT_OBJECT_ID')
    SHAREPOINT_HOSTNAME = os.getenv('SHAREPOINT_HOSTNAME', 'suniquecabinetry.sharepoint.com')
    SHAREPOINT_SITE_NAME = os.getenv('SHAREPOINT_SITE_NAME', 'sccr')
    
    # inFlow Inventory API
    INFLOW_COMPANY_ID = os.getenv('INFLOW_COMPANY_ID')
    INFLOW_API_KEY = os.getenv('INFLOW_API_KEY')
    
    # Email Service Configuration
    EMAIL_CLIENT_ID = os.getenv('EMAIL_CLIENT_ID')
    EMAIL_CLIENT_SECRET = os.getenv('EMAIL_CLIENT_SECRET')
    EMAIL_CLIENT_SECRET_VALUE = os.getenv('EMAIL_CLIENT_SECRET_VALUE')
    EMAIL_TENANT_ID = os.getenv('EMAIL_TENANT_ID')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

