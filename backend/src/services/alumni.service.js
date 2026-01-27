const db = require('../config/db');
const Profile = require('../models/Profile');
const ProfileHistory = require('../models/ProfileHistory');
const User = require('../models/User');
const bcrypt = require('bcrypt');

class AlumniService {
    async getDashboardMetrics() {
        const alumniCountRes = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'egresado'");
        const totalAlumni = parseInt(alumniCountRes.rows[0].count, 10);

        const activeUsersRes = await db.query("SELECT COUNT(DISTINCT user_id) as count FROM egresados_profiles");
        const activeUsers = parseInt(activeUsersRes.rows[0].count, 10);

        const recentlyUpdated = await Profile.countRecentlyUpdated();

        const programStatsRes = await db.query(`
            SELECT programa_academico as label, COUNT(*) as count 
            FROM egresados_profiles 
            WHERE programa_academico IS NOT NULL AND programa_academico != ''
            GROUP BY programa_academico 
            ORDER BY count DESC 
            LIMIT 5
        `);
        const programStats = programStatsRes.rows.map(r => ({
            label: r.label,
            value: Math.round((parseInt(r.count) / activeUsers) * 100) || 0
        }));

        const employmentStatsRes = await db.query(`
            SELECT laboralmente_activo as label, COUNT(*) as count 
            FROM egresados_profiles 
            WHERE laboralmente_activo IS NOT NULL AND laboralmente_activo != ''
            GROUP BY laboralmente_activo
        `);
        const employmentStats = employmentStatsRes.rows.map(r => ({
            label: r.label,
            value: Math.round((parseInt(r.count) / activeUsers) * 100) || 0
        }));

        return {
            totalAlumni,
            activeUsers,
            recentlyUpdated,
            programStats,
            employmentStats
        };
    }

    async getAllAlumniWithProfiles() {
        const query = `
            SELECT p.*, u.id, u.email, u.role
            FROM users u
            LEFT JOIN egresados_profiles p ON u.id = p.user_id
            WHERE u.role = 'egresado'
            ORDER BY u.email ASC
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    async registerNewAlumni(data) {
        const { identificacion, email, nombre, programa_academico, sede } = data;

        const passwordHash = await bcrypt.hash(identificacion, 10);

        const userQuery = `
            INSERT INTO users (id, email, identificacion, password_hash, role, needs_password_change)
            VALUES (gen_random_uuid(), $1, $2, $3, 'egresado', TRUE)
            RETURNING id
        `;
        const { rows: userRows } = await db.query(userQuery, [email, identificacion, passwordHash]);
        const userId = userRows[0].id;

        const profileQuery = `
            INSERT INTO egresados_profiles (user_id, nombre, identificacion, programa_academico, sede, fecha_actualizacion)
            VALUES ($1, $2, $3, $4, $5, NOW())
        `;
        await db.query(profileQuery, [userId, nombre, identificacion, programa_academico, sede]);

        return userId;
    }

    async bulkCreate(alumniList) {
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const alumni of alumniList) {
            try {
                // Ensure required fields map correctly
                const data = {
                    identificacion: alumni['Cédula'] || alumni['cedula'] || alumni['identificacion'],
                    email: alumni['Email'] || alumni['email'],
                    nombre: alumni['Nombre'] || alumni['nombre'],
                    programa_academico: alumni['Programa'] || alumni['programa'] || alumni['programa_academico'],
                    sede: alumni['Sede'] || alumni['sede']
                };

                if (!data.identificacion || !data.email) {
                    throw new Error(`Datos incompletos para: ${JSON.stringify(alumni)}`);
                }

                // Check if user exists first to avoid blowing up with unique constraint errors if possible, 
                // but registerNewAlumni handles insertion. We'll catch duplication errors.
                await this.registerNewAlumni({
                    ...data,
                    identificacion: String(data.identificacion), // Ensure string
                });
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    user: alumni['Nombre'] || alumni['Email'],
                    error: error.message
                });
            }
        }

        return results;
    }

    async deleteAlumni(userId) {
        // Delete profile first (if exists)
        await db.query('DELETE FROM egresados_profiles WHERE user_id = $1', [userId]);
        // Delete user
        const result = await db.query('DELETE FROM users WHERE id = $1 AND role = $2 RETURNING id', [userId, 'egresado']);

        if (result.rows.length === 0) {
            throw new Error('Usuario no encontrado o no es un egresado');
        }

        return result.rows[0].id;
    }

    async bulkDeleteAlumni(userIds) {
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const userId of userIds) {
            try {
                await this.deleteAlumni(userId);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    userId,
                    error: error.message
                });
            }
        }

        return results;
    }

    async getVerifiedGraduates() {
        return await User.findVerifiedUsers();
    }
}

module.exports = new AlumniService();
