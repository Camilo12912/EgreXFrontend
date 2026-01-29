/**
 * AlumniRepository Interface
 * 
 * Defines the contract for Alumni data operations.
 * This is pure Domain layer and doesn't depend on implementation details.
 */
export default class AlumniRepository {
    getAlumniList(filters) { throw new Error('Not implemented'); }
    getVerifiedAlumni() { throw new Error('Not implemented'); }
    getRecentAlumni() { throw new Error('Not implemented'); }
    createAlumni(alumniData) { throw new Error('Not implemented'); }
    getDashboardMetrics() { throw new Error('Not implemented'); }
}
