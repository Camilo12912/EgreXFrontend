const db = require('../config/db');

class User {
    static async create(user) {
        const { email, passwordHash, role } = user;
        const query = `
      INSERT INTO users (id, email, password_hash, role)
      VALUES (gen_random_uuid(), $1, $2, $3)
      RETURNING *;
    `;
        const values = [email, passwordHash, role];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async findByIdentificacion(id) {
        const query = 'SELECT * FROM users WHERE identificacion = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async updateLastLogin(id) {
        const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
        await db.query(query, [id]);
    }

    static async findRecentUsers() {
        const query = `
            SELECT u.id, u.email, u.last_login, p.nombre, p.programa_academico, u.needs_password_change
            FROM users u
            LEFT JOIN egresados_profiles p ON u.id = p.user_id
            WHERE u.last_login IS NOT NULL AND u.role = 'egresado'
            ORDER BY u.last_login DESC
            LIMIT 10
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async findVerifiedUsers() {
        const query = `
            SELECT u.id, u.email, u.last_login, p.nombre, p.programa_academico
            FROM users u
            LEFT JOIN egresados_profiles p ON u.id = p.user_id
            WHERE u.role = 'egresado' AND u.needs_password_change = FALSE
            ORDER BY u.last_login DESC NULLS LAST
        `;
        const { rows } = await db.query(query);
        return rows;
    }
}

module.exports = User;
