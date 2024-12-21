export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
}
