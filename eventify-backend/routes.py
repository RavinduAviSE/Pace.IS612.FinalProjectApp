from datetime import datetime, timedelta
from flask import Blueprint, abort, jsonify
from models import Attendee,Event
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

@routes.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    events_data = [{
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'category': event.category,
        'date': event.date,
        'time': event.time,
        'location': event.location,
        'organizor': event.organizor,
        'organizor_contact_name': event.organizor_contact_name,
        'organizor_contact_email': event.organizor_contact_email,
        'total_seats': event.total_seats,
        'booked_seats': event.booked_seats,
        'allowed_gender': event.allowed_gender,
        'allowed_min_age': event.allowed_min_age,
        'allowed_state': event.allowed_state
    } for event in events]
    return jsonify(events_data)

@routes.route('/api/categorized-events', methods=['GET'])
def get_categorized_events():
    events = Event.query.all()
    this_week = []
    trending = []
    other = []

    today = datetime.today().date()
    one_week_later = today + timedelta(days=7)

    for event in events:
        try:
            event_date = datetime.strptime(event.date, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            continue  # skip if date is invalid

        percentage = (event.booked_seats / event.total_seats) * 100 if event.total_seats > 0 else 0

        if today <= event_date <= one_week_later:
            this_week.append(event)
        elif percentage >= 75:
            trending.append(event)
        else:
            other.append(event)

    def serialize(event):
        return {
            'id': event.id,
            'title': event.title,
            'summary': event.summary,
            'date': event.date,
            'location': event.location,
            'total_seats': event.total_seats,
            'booked_seats': event.booked_seats
        }

    return jsonify({
        'this_week': [serialize(e) for e in this_week],
        'trending': [serialize(e) for e in trending],
        'other': [serialize(e) for e in other],
    })
    
    
@routes.route('/api/events/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    event = Event.query.get(event_id)
    
    if not event:
        abort(404, description="Event not found")

    return jsonify({
        "id": event.id,
        "title": event.title,
        "summary": event.summary,
        "description": event.description,
        "category": event.category,
        "date": event.date,
        "time": event.time,
        "location": event.location,
        "organizor": event.organizor,
        "organizor_contact_name": event.organizor_contact_name,
        "organizor_contact_email": event.organizor_contact_email,
        "total_seats": event.total_seats,
        "booked_seats": event.booked_seats,
        "allowed_gender": event.allowed_gender,
        "allowed_min_age": event.allowed_min_age,
        "allowed_state": event.allowed_state
    })    