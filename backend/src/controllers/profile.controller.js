const ProfileService = require('../services/profile.service');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await ProfileService.getUserProfile(userId);
        res.json(profile);
    } catch (error) {
        if (error.message === 'Profile not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const changedBy = req.user.id;
        const fields = req.body;

        const profile = await ProfileService.updateUserProfile(userId, changedBy, fields);
        res.json(profile);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
