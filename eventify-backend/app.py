# Flask tutorial : https://www.youtube.com/watch?v=zsYIw6RXjfM
from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app=Flask(__name__)

# Use a file-based SQLite DB
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, 'data.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define Attendee model
class Attendee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'age': self.age, 'gender': self.gender}
    
# Route to get all attendees
@app.route('/attendees', methods=['GET'])
def get_attendees():
    attendees = Attendee.query.all()
    return jsonify([a.to_dict() for a in attendees])

@app.route("/get-user/<user_id>")
def get_user(user_id):
    user_data={
        "user_id":user_id,
        "name":"John",
        "email":"john@gmail.com"
    }
    
    extra=request.args.get("extra")
    if request.args.get("extra"):
        user_data["extra"]=extra

    return jsonify(user_data),200

@app.route("/create-user",methods=['POST'])
def create_user():
    data=request.get_json()

    return jsonify(data), 201

if __name__=="__main__":
    with app.app_context():
        db.create_all()  # Creates tables if not exist

        # Insert dummy data if table is empty
        if not Attendee.query.first():
            db.session.add_all([
                Attendee(name='Alice', age=25, gender='female'),
                Attendee(name='Bob', age=30, gender='male')
            ])
            db.session.commit()
            
    app.run(debug=True)