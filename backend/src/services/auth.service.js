const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const db = require('../config/db');

class AuthService {
    async authenticate(identificacion, password) {
        const user = await User.findByIdentificacion(identificacion);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Background task: Track last login
        try {
            await User.updateLastLogin(user.id);
        } catch (e) {
            console.error('Track login error:', e.message);
        }

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                needs_password_change: user.needs_password_change
            }
        };
    }

    async updatePassword(userId, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const hash = await bcrypt.hash(newPassword, 10);
        const query = `
            UPDATE users 
            SET password_hash = $1, needs_password_change = FALSE 
            WHERE id = $2
        `;
        await db.query(query, [hash, userId]);
    }
}

module.exports = new AuthService();
