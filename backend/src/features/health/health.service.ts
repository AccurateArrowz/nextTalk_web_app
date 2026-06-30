import { healthRepository } from "@features/health/health.repository.js";

class HealthService {
  getStatus() {
    return {
      ...healthRepository.getBaseHealth(),
      timestamp: new Date().toISOString()
    };
  }
}

export const healthService = new HealthService();
