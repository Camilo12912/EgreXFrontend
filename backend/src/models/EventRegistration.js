const db = require('../config/db');

class EventRegistration {
    static async register(eventId, userId) {
        const query = `
            INSERT INTO event_registrations (event_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (event_id, user_id) DO NOTHING
            RETURNING *;
        `;
        const { rows } = await db.query(query, [eventId, userId]);
        return rows[0];
    }

    static async unregister(eventId, userId) {
        const query = `
            DELETE FROM event_registrations
            WHERE event_id = $1 AND user_id = $2
            RETURNING *;
        `;
        const { rows } = await db.query(query, [eventId, userId]);
        return rows[0];
    }

    static async getParticipants(eventId) {
        const query = `
            SELECT 
                er.registered_at,
                u.email,
                p.nombre,
                p.telefono,
                p.programa_academico
            FROM event_registrations er
            JOIN users u ON er.user_id = u.id
            LEFT JOIN egresados_profiles p ON u.id = p.user_id
            WHERE er.event_id = $1
            ORDER BY er.registered_at DESC;
        `;
        const { rows } = await db.query(query, [eventId]);
        return rows;
    }

    static async isRegistered(eventId, userId) {
        const query = `
            SELECT 1 FROM event_registrations
            WHERE event_id = $1 AND user_id = $2;
        `;
        const { rows } = await db.query(query, [eventId, userId]);
        return rows.length > 0;
    }
}

module.exports = EventRegistration;
