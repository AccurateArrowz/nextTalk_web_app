"use client";

import { useEffect } from "react";

export function HealthCheck() {
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        // const response = await fetch(`${apiBaseUrl}/health`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   credentials: "include", // Include cookies for CORS
        // });
        const response = await fetch(`${apiBaseUrl}/health`);

        if (!response.ok) {
          console.warn(
            `Backend health check failed with status ${response.status}`
          );
          return;
        }

        const data = await response.json();
        console.log("✓ Backend is healthy:", data);
      } catch (error) {
        console.error(
          "✗ Failed to connect to backend. CORS or connectivity issue:",
          error
        );
      }
    };

    checkBackendHealth();
  }, []);

  return null; // This component doesn't render anything
}
