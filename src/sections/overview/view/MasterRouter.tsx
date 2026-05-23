import React, { useState } from "react";

// Import your day navigators
import DAY1NAV from "./DAY1NAV";
import DAY2NAV from "./DAY2NAV";
import DAY3NAV from "./DAY3NAV";
import DAY4NAV from "./DAY4NAV";
import DAY5NAV from "./DAY5NAV";

const dayNavigators = [
  { component: <DAY1NAV key="day1" />, title: "Day 1" },
  { component: <DAY2NAV key="day2" />, title: "Day 2" },
  { component: <DAY3NAV key="day3" />, title: "Day 3" },
  { component: <DAY4NAV key="day4" />, title: "Day 4" },
  { component: <DAY5NAV key="day5" />, title: "Day 5" },
];

const MasterRouter = () => {
  const [currentDay, setCurrentDay] = useState(0);

  const nextDay = () => setCurrentDay((d) => Math.min(d + 1, dayNavigators.length - 1));
  const prevDay = () => setCurrentDay((d) => Math.max(d - 1, 0));
  const goToDay = (dayIndex) => setCurrentDay(dayIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with day selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            5-Day Journey
          </h1>
          
          {/* Day tabs */}
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {dayNavigators.map((day, index) => (
              <button
                key={index}
                onClick={() => goToDay(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentDay === index
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day.title}
              </button>
            ))}
          </div>

          {/* Overall progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{currentDay + 1} / {dayNavigators.length} Days</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentDay + 1) / dayNavigators.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Day content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px]">
          {dayNavigators[currentDay].component}
        </div>

        {/* Master navigation controls */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={prevDay}
            disabled={currentDay === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentDay === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
            }`}
          >
            ← Previous Day
          </button>
          
          <div className="text-gray-600 font-medium">
            {dayNavigators[currentDay].title}
          </div>
          
          <button
            onClick={nextDay}
            disabled={currentDay === dayNavigators.length - 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentDay === dayNavigators.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
            }`}
          >
            Next Day →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterRouter;