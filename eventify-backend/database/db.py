import os
from flask_sqlalchemy import SQLAlchemy

# Define where the DB file should go
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'data.sqlite')

# SQLAlchemy instance (no app bound yet)
db = SQLAlchemy()

# Configuration function
def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)