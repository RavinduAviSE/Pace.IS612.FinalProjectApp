from flask import Flask
from flask_cors import CORS
from database.db import init_db, db
from models import *
from routes import routes

app = Flask(__name__)
CORS(app)
init_db(app)

app.register_blueprint(routes)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
