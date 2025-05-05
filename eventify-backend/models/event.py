from database.db import db

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    summary = db.Column(db.String(300), nullable=False)
    description = db.Column(db.String(800))
    category = db.Column(db.String(50))
    date = db.Column(db.String(20))
    time= db.Column(db.String(20))
    location = db.Column(db.String(100))
    organizor = db.Column(db.String(100))
    organizor_contact_name = db.Column(db.String(100))
    organizor_contact_email = db.Column(db.String(100))
    total_seats=db.Column(db.Integer, nullable=False)
    booked_seats = db.Column(db.Integer, default=0) 
    allowed_gender = db.Column(db.String(10))
    allowed_min_age=db.Column(db.Integer)
    allowed_state = db.Column(db.String(100))