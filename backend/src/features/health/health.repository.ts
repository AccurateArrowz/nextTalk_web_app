class HealthRepository {
  getBaseHealth() {
    return {
      status: "ok" as const,
      service: "nexttalk-backend"
    };
  }
}

export const healthRepository = new HealthRepository();
