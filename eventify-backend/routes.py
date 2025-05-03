from flask import Blueprint, jsonify
from models import Attendee
from database.db import db

routes = Blueprint('routes', __name__)

@routes.route('/attendees', methods=['GET'])
def get_attendees():
    attendees = Attendee.query.all()
    return jsonify([{
        'id': a.id,
        'firstname': a.firstname,
        'lastname': a.lastname,
        'age': a.age,
        'gender': a.gender,
        'state': a.state
    } for a in attendees])