"use client"

import * as React from "react"
import { format, isWithinInterval } from "date-fns"
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  Snowflake, 
  Thermometer
} from "lucide-react"

// ** import utils
import { cn } from "@/lib/utils"

// ** import components
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// ** import types
import { WeatherData } from "@/types/weather"

interface WeatherProps {
  data: WeatherData
  className?: string
}

const getWeatherIcon = (temp: number, isDay: boolean) => {
  if (temp <= 0) return <Snowflake className="w-full h-full text-blue-500 dark:text-blue-300" />
  if (temp <= 15) {
    return isDay 
      ? <CloudSun className="w-full h-full text-gray-600 dark:text-gray-300" />
      : <CloudMoon className="w-full h-full text-gray-500 dark:text-gray-400" />
  }
  if (temp <= 25) {
    return isDay 
      ? <Sun className="w-full h-full text-yellow-600 dark:text-yellow-400" />
      : <Moon className="w-full h-full text-blue-400 dark:text-blue-200" />
  }
  return <Thermometer className="w-full h-full text-red-600 dark:text-red-500" />
}

const getBackgroundColor = (temp: number, isDay: boolean) => {
  if (temp <= 0) return "bg-blue-200 dark:bg-blue-900"
  if (temp <= 15) return isDay ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-800"
  if (temp <= 25) return isDay ? "bg-yellow-300 dark:bg-yellow-900" : "bg-blue-300 dark:bg-blue-900"
  return "bg-red-300 dark:bg-red-900"
}

export function Weather({ data, className }: WeatherProps) {
  const currentHigh = Math.max(...data.hourly.temperature_2m.slice(0, 24))
  const currentLow = Math.min(...data.hourly.temperature_2m.slice(0, 24))

  const isDay = isWithinInterval(new Date(data.current.time), {
    start: new Date(data.daily.sunrise[0]),
    end: new Date(data.daily.sunset[0]),
  })

  const currentTimeIndex = data.hourly.time.findIndex(
    (time) => new Date(time) >= new Date(data.current.time)
  )

  // Show next 24 hours of data
  const displayTimes = data.hourly.time.slice(currentTimeIndex, currentTimeIndex + 24)
  const displayTemperatures = data.hourly.temperature_2m.slice(currentTimeIndex, currentTimeIndex + 24)

  const currentTemp = Math.ceil(data.current.temperature_2m)

  return (
    <Card
      className={cn(
        "w-full max-w-[500px] p-6",
        "bg-gradient-to-br",
        isDay 
          ? "from-blue-400 to-blue-500 dark:from-blue-700 dark:to-blue-900"
          : "from-indigo-400 to-indigo-500 dark:from-indigo-700 dark:to-indigo-900",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full p-3",
              getBackgroundColor(currentTemp, isDay)
            )}
          >
            {getWeatherIcon(currentTemp, isDay)}
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-medium text-gray-900 dark:text-white">
              {currentTemp}°C
            </div>
            <div className="text-sm text-gray-700 dark:text-blue-100">
              {data.timezone}
            </div>
          </div>
        </div>

        <div className="text-gray-900 dark:text-white text-sm font-medium bg-gray-100/50 dark:bg-white/10 px-3 py-1 rounded-full">
          H:{Math.ceil(currentHigh)}° L:{Math.ceil(currentLow)}°
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-300 dark:border-white/10 mt-2">
        <div className="flex p-4">
          {displayTimes.map((time, index) => {
            const temp = Math.ceil(displayTemperatures[index])
            return (
              <div
                key={time}
                className="flex flex-col items-center gap-2 px-3 first:pl-0 last:pr-0"
              >
                <span className="text-gray-900 dark:text-white text-xs">
                  {format(new Date(time), "ha")}
                </span>
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center p-2",
                    getBackgroundColor(temp, isDay)
                  )}
                >
                  {getWeatherIcon(temp, isDay)}
                </div>
                <span className="text-gray-900 dark:text-white text-sm font-medium">
                  {temp}°
                </span>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="bg-gray-200 dark:bg-white/10" />
      </ScrollArea>
    </Card>
  )
}

export default Weather
