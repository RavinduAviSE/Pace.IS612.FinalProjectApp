from datetime import datetime, timedelta
from flask import Blueprint, abort, jsonify, request,send_file, make_response
from io import BytesIO
from reportlab.pdfgen import canvas
from models import Event,Booking
from database.db import db

routes = Blueprint('routes', __name__)

@routes.route('/api/events', methods=['GET'])
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
    
@routes.route('/api/register', methods=['POST'])
def book_event():
    data = request.json

    firstname = data.get('firstname')
    lastname = data.get('lastname')
    age = data.get('age')
    gender = data.get('gender')
    state = data.get('state')
    event_id = data.get('event_id')

    if not all([firstname,lastname, age, gender, state, event_id]):
        return jsonify({"success": False, "message": "Missing required fields."}), 400

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"success": False, "message": "Event not found."}), 404

    # Check gender restriction
    if event.allowed_gender.lower() != 'any' and gender.lower() != event.allowed_gender.lower():
        return jsonify({"success": False, "message": "This event is restricted by gender."}), 403

    # Check age restriction
    if event.allowed_min_age and age < event.allowed_min_age:
        return jsonify({"success": False, "message": f"Minimum age required is {event.allowed_min_age}."}), 403

    # Check state restriction
    if event.allowed_state.lower() != 'any' and state.lower() != event.allowed_state.lower():
        return jsonify({"success": False, "message": "This event is restricted to a different state."}), 403

    # Check seat availability
    if event.booked_seats >= event.total_seats:
        return jsonify({"success": False, "message": "No seats available."}), 403

    # Create booking
    booking = Booking(
        event_id=event.id,
        firstname=firstname,
        lastname=lastname,
        age=age,
        gender=gender,
        state=state
    )
    db.session.add(booking)

    # Update booked seats
    event.booked_seats += 1
    db.session.commit()

    return jsonify({"success": True, "message": "Booking successful!", "booking_id": booking.id}), 201

@routes.route('/api/ticket/<int:booking_id>', methods=['GET'])
def download_ticket(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return {"message": "Booking not found"}, 404

    event = Event.query.get(booking.event_id)
    if not event:
        return {"message": "Event not found"}, 404

    buffer = BytesIO()
    c = canvas.Canvas(buffer)
    c.setFont("Helvetica", 12)
    
    c.drawString(50, 800, "🎟 Event Reservation Ticket")
    c.line(50, 795, 400, 795)
    c.drawString(50, 770, f"Event: {event.title}")
    c.drawString(50, 750, f"Date & Time: {event.date} at {event.time}")
    c.drawString(50, 730, f"Location: {event.location}")
    c.drawString(50, 710, f"Booked By: {booking.firstname} {booking.lastname}")
    c.drawString(50, 690, f"Booking ID: {booking.id}")
    c.drawString(50, 670, "Thank you for registering!")

    c.showPage()
    c.save()

    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="ticket.pdf", mimetype='application/pdf')