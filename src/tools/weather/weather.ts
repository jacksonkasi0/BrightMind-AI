import { tool } from 'ai';
import { z } from "zod";

export const getWeather = tool({
    description: "Get the current weather at a location",
    parameters: z.object({
      latitude: z.number().describe("Latitude coordinate"),
      longitude: z.number().describe("Longitude coordinate"),
    }),
    experimental_toToolResultContent: (result) => {
      console.log("Experimental toToolResultContent:", result);
      return result as any
    },
    execute: async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
        );
  
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }
  
        const weatherData = await response.json();
        return weatherData;
      } catch (error) {
        console.error("Error in getWeather:", error);
        throw error;
      }
    }
  });
  