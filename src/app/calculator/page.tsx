"use client";

import { useState } from "react";

export default function CalculatorPage() {
  const [carValue, setCarValue] = useState<number | "">("");
  const [coverageType, setCoverageType] = useState("comprehensive");
  const [premium, setPremium] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  const MAX_CAR_VALUE = 100_000_000;

  const calculatePremium = () => {
    if (carValue === "" || carValue <= 0 || carValue > MAX_CAR_VALUE) {
      setPremium(null);
      setRate(null);
      return;
    }

    let selectedRate = 0;

    if (coverageType === "comprehensive") selectedRate = 0.05;
    else if (coverageType === "third-party") selectedRate = 0.02;
    else if (coverageType === "fire-theft") selectedRate = 0.03;

    setRate(selectedRate);
    setPremium(carValue * selectedRate);
  };

  const resetCalculator = () => {
    setCarValue("");
    setCoverageType("comprehensive");
    setPremium(null);
    setRate(null);
  };

  const coverageDescriptions: Record<string, string> = {
    comprehensive: "Full coverage: damage, fire, theft, and third-party liability.",
    "third-party": "Covers only damage or injury you cause to others.",
    "fire-theft": "Covers fire damage and theft, not collision or third-party.",
  };

  const isValidInput = carValue !== "" && carValue > 0 && carValue <= MAX_CAR_VALUE;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Vehicle Insurance Calculator
        </h1>

        {/* Car Value Input */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Car Value (USD)
          </label>
          <input
            type="number"
            value={carValue}
            onChange={(e) => {
              const value = e.target.value === "" ? "" : Number(e.target.value);
              if (value === "" || (value >= 0 && value <= MAX_CAR_VALUE)) setCarValue(value);
            }}
            placeholder="Enter car value"
            className="w-full border border-gray-300 rounded-lg p-2 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none 
                       placeholder-gray-600 text-gray-900"
          />
        </div>

        {/* Coverage Type Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Coverage Type
          </label>
          <select
            value={coverageType}
            onChange={(e) => setCoverageType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none 
                       text-gray-900"
          >
            <option value="comprehensive">Comprehensive</option>
            <option value="third-party">Third Party Only</option>
            <option value="fire-theft">Fire & Theft</option>
          </select>
          <p className="mt-2 text-sm text-gray-600 italic">
            {coverageDescriptions[coverageType]}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={calculatePremium}
            disabled={!isValidInput}
            className={`flex-1 bg-blue-600 text-white font-medium p-3 rounded-lg 
                        hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Calculate Premium
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 bg-gray-300 text-gray-800 font-medium p-3 rounded-lg 
                       hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Result + Breakdown */}
        {premium !== null && rate !== null && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Estimated Premium: <span className="text-green-600">${premium.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Breakdown: Car Value (${carValue}) × Rate ({(rate * 100).toFixed(1)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
