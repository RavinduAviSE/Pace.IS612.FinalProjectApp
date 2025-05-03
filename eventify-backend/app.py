from flask import Flask
from database.db import init_db, db
from models import *   
from routes import routes

app=Flask(__name__)
init_db(app)

app.register_blueprint(routes)

if __name__=="__main__":
    with app.app_context():
        db.create_all()  
            
    app.run(debug=True)