"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

export default function CalculatorPage() {
  const [carValue, setCarValue] = useState<number | "">("");
  const [coverageType, setCoverageType] = useState("comprehensive");
  const [excessProtector, setExcessProtector] = useState(false);
  const [politicalTerrorismCover, setPoliticalTerrorismCover] = useState(false);
  const [premium, setPremium] = useState<number | null>(null);
  const [additionalCovers, setAdditionalCovers] = useState<{
    excessProtector: number;
    politicalTerrorism: number;
    courtesyCar: number;
  }>({ excessProtector: 0, politicalTerrorism: 0, courtesyCar: 0 });
  const [courtesyCar, setCourtesyCar] = useState<"none" | "10days" | "20days">("none");
  const [basicPremium, setBasicPremium] = useState<number | null>(null);
  const [levies, setLevies] = useState<{
    stampDuty: number;
    trainingLevy: number;
    phcf: number;
    policyCharge: number;
  }>({ stampDuty: 0, trainingLevy: 0, phcf: 0, policyCharge: 0 });

  const MAX_CAR_VALUE = 100_000_000;
  const formatKES = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  const calculatePremium = useCallback(() => {
    if (carValue === "" || Number(carValue) <= 0 || Number(carValue) > MAX_CAR_VALUE) {
      resetCalculator();
      return;
    }

    let baseRate = 0;
    if (coverageType === "comprehensive") baseRate = 0.05;
    else if (coverageType === "third-party") baseRate = 0.02;
    else if (coverageType === "fire-theft") baseRate = 0.03;

    const numCarValue = Number(carValue);
    let valueMultiplier = 1;
    if (numCarValue >= 500_000 && numCarValue < 1_000_000) valueMultiplier = 1.2;
    else if (numCarValue >= 1_000_000 && numCarValue < 1_500_000) valueMultiplier = 1.0;
    else if (numCarValue >= 1_500_000 && numCarValue < 2_500_000) valueMultiplier = 0.8;
    else if (numCarValue >= 2_500_000) valueMultiplier = 0.6;

    const finalRate = baseRate * valueMultiplier;
    const computedBasePremium = numCarValue * finalRate;
    const basePremium = Math.max(computedBasePremium, 37_500);

    const excessProtectorCost = excessProtector ? Math.max(numCarValue * 0.0025, 5000) : 0;
    const politicalTerrorismCost =
      politicalTerrorismCover && numCarValue > 4_000_000 ? numCarValue * 0.0025 : 0;
    const courtesyCarCost = courtesyCar === "10days" ? 4500 : courtesyCar === "20days" ? 7500 : 0;

    const calculatedBasicPremium = basePremium + excessProtectorCost + politicalTerrorismCost + courtesyCarCost;

    const stampDuty = 40;
    const trainingLevy = calculatedBasicPremium * 0.002;
    const phcf = calculatedBasicPremium * 0.0025;
    const policyCharge = 1000;

    const totalPremium =
      calculatedBasicPremium + stampDuty + trainingLevy + phcf + policyCharge;

    setBasicPremium(calculatedBasicPremium);
    setPremium(totalPremium);
    setAdditionalCovers({ 
      excessProtector: excessProtectorCost, 
      politicalTerrorism: politicalTerrorismCost,
      courtesyCar: courtesyCarCost 
    });
    setLevies({ stampDuty, trainingLevy, phcf, policyCharge });
  }, [carValue, coverageType, excessProtector, politicalTerrorismCover, courtesyCar]);

  const isValidInput = useMemo(() => {
    return carValue !== "" && Number(carValue) > 0 && Number(carValue) <= MAX_CAR_VALUE;
  }, [carValue]);

  // Real-time calculation effect
  useEffect(() => {
    if (isValidInput) {
      calculatePremium();
    }
  }, [calculatePremium, isValidInput]);

  const resetCalculator = () => {
    setCarValue("");
    setCoverageType("comprehensive");
    setExcessProtector(false);
    setPoliticalTerrorismCover(false);
    setCourtesyCar("none");
    setPremium(null);
    setAdditionalCovers({ excessProtector: 0, politicalTerrorism: 0, courtesyCar: 0 });
    setBasicPremium(null);
    setLevies({ stampDuty: 0, trainingLevy: 0, phcf: 0, policyCharge: 0 });
  };

  const coverageDescriptions: Record<string, string> = {
    comprehensive: "Full coverage: damage, fire, theft, and third-party liability.",
    "third-party": "Covers only damage or injury you cause to others.",
    "fire-theft": "Covers fire damage and theft, not collision or third-party.",
  };

  useEffect(() => {
    const matchHeights = () => {
      const inputCard = document.getElementById('input-card');
      const outputCard = document.getElementById('output-card');
      if (inputCard && outputCard) {
        const inputHeight = inputCard.offsetHeight;
        outputCard.style.height = `${inputHeight}px`;
        outputCard.style.minHeight = `${inputHeight}px`;
      }
    };

    matchHeights();

    const resizeObserver = new ResizeObserver(matchHeights);
    const inputCard = document.getElementById('input-card');
    if (inputCard) resizeObserver.observe(inputCard);
    window.addEventListener('resize', matchHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', matchHeights);
    };
  }, [carValue, coverageType, excessProtector, politicalTerrorismCover, courtesyCar, basicPremium]);

  const AnimatedValue = ({ value }: { value: number | string }) => (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
      className="font-semibold"
    >
      {value}
    </motion.span>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200" id="input-card">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Vehicle Insurance Calculator</h1>

          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700 text-sm">Car Value (KSh)</label>
            <input
              type="number"
              value={carValue}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : Number(e.target.value);
                if (value === "" || (Number(value) >= 0 && Number(value) <= MAX_CAR_VALUE)) setCarValue(value);
              }}
              placeholder="Enter car value"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 text-gray-900"
            />
            {carValue !== "" && Number(carValue) > MAX_CAR_VALUE && (
              <p className="text-red-500 text-xs mt-1">
                Maximum car value is {formatKES(MAX_CAR_VALUE)}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700 text-sm">Coverage Type</label>
            <select
              value={coverageType}
              onChange={(e) => setCoverageType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
            >
              <option value="comprehensive">Comprehensive</option>
              <option value="third-party">Third Party Only</option>
              <option value="fire-theft">Fire & Theft</option>
            </select>
            <p className="mt-1 text-xs text-gray-600 italic">{coverageDescriptions[coverageType]}</p>
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700 text-sm">Additional Covers</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="excessProtector"
                  checked={excessProtector}
                  onChange={(e) => setExcessProtector(e.target.checked)}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="excessProtector" className="ml-1 text-xs text-gray-700">
                  Excess Protector (0.25% of car value, min KSh 5,000)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="politicalTerrorismCover"
                  checked={politicalTerrorismCover}
                  onChange={(e) => setPoliticalTerrorismCover(e.target.checked)}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="politicalTerrorismCover" className="ml-1 text-xs text-gray-700">
                  Political & Terrorism Cover (Free up to KSh 4,000,000, then 0.25%)
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700 text-sm">Courtesy Car</label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="courtesyCarNone"
                  name="courtesyCar"
                  value="none"
                  checked={courtesyCar === "none"}
                  onChange={(e) => setCourtesyCar(e.target.value as "none" | "10days" | "20days")}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="courtesyCarNone" className="ml-1 text-xs text-gray-700">
                  No Courtesy Car
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="courtesyCar10Days"
                  name="courtesyCar"
                  value="10days"
                  checked={courtesyCar === "10days"}
                  onChange={(e) => setCourtesyCar(e.target.value as "none" | "10days" | "20days")}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="courtesyCar10Days" className="ml-1 text-xs text-gray-700">
                  10 Days (+KSh 4,500)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="courtesyCar20Days"
                  name="courtesyCar"
                  value="20days"
                  checked={courtesyCar === "20days"}
                  onChange={(e) => setCourtesyCar(e.target.value as "none" | "10days" | "20days")}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="courtesyCar20Days" className="ml-1 text-xs text-gray-700">
                  20 Days (+KSh 7,500)
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={resetCalculator}
              className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200" id="output-card">
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-900">Premium Breakdown</h2>
          {premium === null ? (
            <p className="text-gray-700 text-center mt-4 text-sm">Enter details to see your premium.</p>
          ) : (
            <div className="space-y-3 text-gray-900">
              <div className="flex justify-between">
                <span>Basic Premium:</span>
                <AnimatedValue value={formatKES(basicPremium!)} />
              </div>
              <div className="flex justify-between">
                <span>Excess Protector:</span>
                <AnimatedValue value={additionalCovers.excessProtector ? formatKES(additionalCovers.excessProtector) : "KSh 0"} />
              </div>
              <div className="flex justify-between">
                <span>Political/Terrorism Cover:</span>
                <AnimatedValue value={additionalCovers.politicalTerrorism ? formatKES(additionalCovers.politicalTerrorism) : "Free"} />
              </div>
              <div className="flex justify-between">
                <span>Courtesy Car:</span>
                <AnimatedValue value={additionalCovers.courtesyCar ? formatKES(additionalCovers.courtesyCar) : "KSh 0"} />
              </div>
              <div className="border-t border-gray-300 pt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Stamp Duty:</span>
                  <AnimatedValue value={formatKES(levies.stampDuty)} />
                </div>
                <div className="flex justify-between">
                  <span>Insurance Training Levy:</span>
                  <AnimatedValue value={formatKES(levies.trainingLevy)} />
                </div>
                <div className="flex justify-between">
                  <span>PHCF:</span>
                  <AnimatedValue value={formatKES(levies.phcf)} />
                </div>
                <div className="flex justify-between">
                  <span>Policy Charge:</span>
                  <AnimatedValue value={formatKES(levies.policyCharge)} />
                </div>
              </div>
              <div className="border-t border-gray-400 pt-2 flex justify-between font-bold text-lg">
                <span>Total Premium:</span>
                <AnimatedValue value={formatKES(premium)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}