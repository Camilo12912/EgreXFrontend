const db = require('../config/db');

class Profile {
    static async findByUserId(userId) {
        const query = 'SELECT * FROM egresados_profiles WHERE user_id = $1';
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }

    static async create(profile) {
        const {
            userId, nombre, telefono, profesion, empresa,
            correo_personal, identificacion, ciudad_residencia, direccion_domicilio, barrio,
            programa_academico, sede, laboralmente_activo, cargo_actual, sector_economico,
            nombre_empresa, rango_salarial, ejerce_perfil_profesional, reconocimientos, tratamiento_datos
        } = profile;

        const query = `
            INSERT INTO egresados_profiles (
                id, user_id, nombre, telefono, profesion, empresa, fecha_actualizacion,
                correo_personal, identificacion, ciudad_residencia, direccion_domicilio, barrio,
                programa_academico, sede, laboralmente_activo, cargo_actual, sector_economico,
                nombre_empresa, rango_salarial, ejerce_perfil_profesional, reconocimientos, tratamiento_datos
            )
            VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, NOW(),
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20
            )
            RETURNING *;
        `;
        const values = [
            userId, nombre, telefono, profesion, empresa,
            correo_personal, identificacion, ciudad_residencia, direccion_domicilio, barrio,
            programa_academico, sede, laboralmente_activo, cargo_actual, sector_economico,
            nombre_empresa, rango_salarial, ejerce_perfil_profesional, reconocimientos, tratamiento_datos
        ];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async update(userId, fields) {
        const {
            nombre, telefono, profesion, empresa,
            correo_personal, identificacion, ciudad_residencia, direccion_domicilio, barrio,
            programa_academico, sede, laboralmente_activo, cargo_actual, sector_economico,
            nombre_empresa, rango_salarial, ejerce_perfil_profesional, reconocimientos, tratamiento_datos
        } = fields;

        // Build dynamic query for partial update
        const updates = [];
        const values = [userId];
        let paramIndex = 2;

        const columns = [
            'nombre', 'telefono', 'profesion', 'empresa',
            'correo_personal', 'identificacion', 'ciudad_residencia', 'direccion_domicilio', 'barrio',
            'programa_academico', 'sede', 'laboralmente_activo', 'cargo_actual', 'sector_economico',
            'nombre_empresa', 'rango_salarial', 'ejerce_perfil_profesional', 'reconocimientos', 'tratamiento_datos'
        ];

        const fieldValues = {
            nombre, telefono, profesion, empresa,
            correo_personal, identificacion, ciudad_residencia, direccion_domicilio, barrio,
            programa_academico, sede, laboralmente_activo, cargo_actual, sector_economico,
            nombre_empresa, rango_salarial, ejerce_perfil_profesional, reconocimientos, tratamiento_datos
        };

        columns.forEach(col => {
            if (fieldValues[col] !== undefined) {
                updates.push(`${col} = $${paramIndex++}`);
                values.push(fieldValues[col]);
            }
        });

        if (updates.length === 0) return null;

        updates.push(`fecha_actualizacion = NOW()`);

        const query = `
            UPDATE egresados_profiles
            SET ${updates.join(', ')}
            WHERE user_id = $1
            RETURNING *;
        `;

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    // Admin metric helper
    static async countRecentlyUpdated() {
        // Count profiles updated in the last 30 days
        const query = `
      SELECT COUNT(*) as count 
      FROM egresados_profiles 
      WHERE fecha_actualizacion > NOW() - INTERVAL '30 days'
    `;
        const { rows } = await db.query(query);
        return parseInt(rows[0].count, 10);
    }
}

module.exports = Profile;
