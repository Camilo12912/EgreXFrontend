const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

class EventService {
    async getEventsForUser(userId) {
        const events = await Event.findAll();
        return await Promise.all(events.map(async (event) => {
            const isRegistered = await EventRegistration.isRegistered(event.id, userId);
            return { ...event, isRegistered };
        }));
    }

    async createEvent(eventData) {
        const { title, date } = eventData;
        if (!title || !date) {
            throw new Error('Title and Date are required');
        }

        const eventDate = new Date(date);
        const now = new Date();

        if (isNaN(eventDate.getTime())) {
            throw new Error('Invalid Date');
        }

        if (eventDate < now) {
            throw new Error('Cannot create event in the past');
        }

        return await Event.create(eventData);
    }

    async deleteEvent(id) {
        const deleted = await Event.delete(id);
        if (!deleted) {
            throw new Error('Event not found');
        }
        return true;
    }

    async registerUserToEvent(eventId, userId) {
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        const eventDate = new Date(event.date);
        const currentDate = new Date();

        if (eventDate < currentDate) {
            throw new Error('Cannot register for past events');
        }

        return await EventRegistration.register(eventId, userId);
    }

    async getParticipants(eventId) {
        return await EventRegistration.getParticipants(eventId);
    }
}

module.exports = new EventService();
