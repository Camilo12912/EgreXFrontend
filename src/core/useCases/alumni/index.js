export class GetAlumniListUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    execute(filters) {
        return this.repository.getAlumniList(filters);
    }
}

export class CreateAlumniUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    execute(data) {
        return this.repository.createAlumni(data);
    }
}

export class GetVerifiedAlumniUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    execute() {
        return this.repository.getVerifiedAlumni();
    }
}

export class GetDashboardMetricsUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    execute() {
        return this.repository.getDashboardMetrics();
    }
}

export class GetRecentAlumniUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    execute() {
        return this.repository.getRecentAlumni();
    }
}
