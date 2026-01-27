const db = require('../config/db');

class Event {
    static async findAll() {
        const query = 'SELECT id, title, description, date, location, image_url, image_data FROM events ORDER BY date ASC';
        const { rows } = await db.query(query);
        return rows;
    }

    static async create(event) {
        const { title, description, date, location, imageUrl, imageData } = event;
        const query = `
      INSERT INTO events (id, title, description, date, location, image_url, image_data)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const values = [title, description, date, location, imageUrl, imageData];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM events WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM events WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = Event;
