const db = require('../config/db');

class ProfileHistory {
    static async logChange(userId, changedBy, fieldName, oldValue, newValue) {
        const query = `
            INSERT INTO profile_modifications (user_id, changed_by, field_name, old_value, new_value)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [userId, changedBy, fieldName, oldValue, newValue];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async getByUserId(userId) {
        const query = `
            SELECT pm.*, u.email as changed_by_email
            FROM profile_modifications pm
            JOIN users u ON pm.changed_by = u.id
            WHERE pm.user_id = $1
            ORDER BY pm.created_at DESC;
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }

    static async getGlobalHistory(limit = 20) {
        const query = `
            SELECT pm.*, u.email as user_email, cb.email as changed_by_email
            FROM profile_modifications pm
            JOIN users u ON pm.user_id = u.id
            JOIN users cb ON pm.changed_by = cb.id
            ORDER BY pm.created_at DESC
            LIMIT $1;
        `;
        const { rows } = await db.query(query, [limit]);
        return rows;
    }
}

module.exports = ProfileHistory;
