import { makeAssistantToolUI } from "@assistant-ui/react";

// ** import components
import { Loader } from "lucide-react";

// ** import types
import { WeatherData } from "@/types/weather";

// ** import tools component
import WeatherForecast from "./Component";

type WebSearchArgs = {
  query: string;
};

export const WebSearchToolUI = makeAssistantToolUI<WebSearchArgs, WeatherData>({
  toolName: "getWeather",
  render: ({ args, status, result }) => {
    if (status.type === "running") {
      return <Loader />;
    }

    if (status.type === "incomplete") {
      return <div>Missing required arguments</div>;
    }

    if (!result) return null;

    return <WeatherForecast data={result} />;
  },
});
