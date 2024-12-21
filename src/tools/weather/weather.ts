import { z } from "zod";

export const getWeather = {
    description: "Get the current weather at a location",
    parameters: z.object({
      latitude: z.number().describe("Latitude coordinate"),
      longitude: z.number().describe("Longitude coordinate"),
    }),
    execute: async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      try {
        console.log("Executing getWeather with:", { latitude, longitude });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
        );
  
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }
  
        const weatherData = await response.json();
        console.log("Weather Data:", weatherData);
        return weatherData;
      } catch (error) {
        console.error("Error in getWeather:", error);
        throw error;
      }
    },
  };
  