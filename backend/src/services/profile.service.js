const Profile = require('../models/Profile');
const ProfileHistory = require('../models/ProfileHistory');

class ProfileService {
    async getUserProfile(userId) {
        const profile = await Profile.findByUserId(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    }

    async updateUserProfile(userId, changedBy, fields) {
        let profile = await Profile.findByUserId(userId);

        if (!profile) {
            profile = await Profile.create({ userId, ...fields });
            await ProfileHistory.logChange(userId, changedBy, 'perfil', null, 'Creado');
        } else {
            const columns = [
                'nombre', 'telefono', 'profesion', 'empresa',
                'correo_personal', 'identificacion', 'ciudad_residencia', 'direccion_domicilio', 'barrio',
                'programa_academico', 'sede', 'laboralmente_activo', 'cargo_actual', 'sector_economico',
                'nombre_empresa', 'rango_salarial', 'ejerce_perfil_profesional', 'reconocimientos', 'tratamiento_datos'
            ];

            for (const col of columns) {
                if (fields[col] !== undefined && String(fields[col]) !== String(profile[col] || '')) {
                    await ProfileHistory.logChange(
                        userId,
                        changedBy,
                        col,
                        profile[col] ? String(profile[col]) : null,
                        String(fields[col])
                    );
                }
            }

            const updated = await Profile.update(userId, fields);
            if (updated) profile = updated;
        }

        return profile;
    }
}

module.exports = new ProfileService();
