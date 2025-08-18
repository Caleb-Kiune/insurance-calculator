"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

export default function CalculatorPage() {
  const [calculatorType, setCalculatorType] = useState<"private" | "commercial">("private");
  const [carValueInput, setCarValueInput] = useState<string>(""); // formatted input
  const [carValue, setCarValue] = useState<number | "">("");
  const [coverageType, setCoverageType] = useState("comprehensive");
  const [commercialCoverageType, setCommercialCoverageType] = useState<"comprehensive" | "third-party">("comprehensive");
  const [excessProtector, setExcessProtector] = useState(false);
  const [politicalTerrorismCover, setPoliticalTerrorismCover] = useState(false);
  const [courtesyCar, setCourtesyCar] = useState<"none" | "10days" | "20days">("none");
  const [fleetType, setFleetType] = useState<"single" | "fleet">("single");
  const [tonnage, setTonnage] = useState<number | "">("");
  const [usageType, setUsageType] = useState<"general" | "own">("general");
  const [premium, setPremium] = useState<number | null>(null);
  const [basicPremium, setBasicPremium] = useState<number | null>(null);
  const [additionalCovers, setAdditionalCovers] = useState<{
    excessProtector: number;
    politicalTerrorism: number;
    courtesyCar: number;
  }>({ excessProtector: 0, politicalTerrorism: 0, courtesyCar: 0 });
  const [levies, setLevies] = useState<{
    stampDuty: number;
    trainingLevy: number;
    phcf: number;
    policyCharge: number;
  }>({ stampDuty: 0, trainingLevy: 0, phcf: 0, policyCharge: 0 });

  const MAX_CAR_VALUE = 100_000_000;

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-KE").format(num);

  const formatKES = (amount: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

  // Private vehicle premium calculation
  const calculatePrivatePremium = useCallback((
    carValue: number,
    coverageType: string,
    excessProtector: boolean,
    politicalTerrorismCover: boolean,
    courtesyCar: string
  ) => {
    let basePremium = 0;
    let baseRate = 0;
    let excessProtectorCost = 0;
    let politicalTerrorismCost = 0;
    let courtesyCarCost = 0;

    if (coverageType === "third-party") {
      // Fixed premium for third party
      basePremium = 7500;
      baseRate = 0; // No percentage for third party
    } else {
      // Comprehensive logic
      baseRate = 0.05;
      let valueMultiplier = 1;

      if (carValue >= 500_000 && carValue < 1_000_000) valueMultiplier = 1.2;
      else if (carValue >= 1_000_000 && carValue < 1_500_000) valueMultiplier = 1.0;
      else if (carValue >= 1_500_000 && carValue < 2_500_000) valueMultiplier = 0.8;
      else if (carValue >= 2_500_000) valueMultiplier = 0.6;

      const finalRate = baseRate * valueMultiplier;
      const computedBasePremium = carValue * finalRate;
      basePremium = Math.max(computedBasePremium, 37_500);
      baseRate = finalRate; // Store the actual rate used for display

      excessProtectorCost = excessProtector ? Math.max(carValue * 0.0025, 5000) : 0;
      politicalTerrorismCost =
        politicalTerrorismCover && carValue > 4_000_000 ? carValue * 0.0025 : 0;
      courtesyCarCost = courtesyCar === "10days" ? 4500 : courtesyCar === "20days" ? 7500 : 0;
    }

    const totalBasicPremium = basePremium + excessProtectorCost + politicalTerrorismCost + courtesyCarCost;

    const stampDuty = 40;
    const trainingLevy = totalBasicPremium * 0.002;
    const phcf = totalBasicPremium * 0.0025;
    const policyCharge = 1000;

    const totalPremium = totalBasicPremium + stampDuty + trainingLevy + phcf + policyCharge;

    return {
      basicPremium: basePremium,
      premium: totalPremium,
      additionalCovers: { excessProtector: excessProtectorCost, politicalTerrorism: politicalTerrorismCost, courtesyCar: courtesyCarCost },
      levies: { stampDuty, trainingLevy, phcf, policyCharge },
    };
  }, []);

  // Commercial vehicle premium calculation
  const calculateCommercialPremium = useCallback((
    carValue: number,
    isFleet: boolean,
    coverage: "comprehensive" | "third-party" = "comprehensive",
    tonnageValue?: number,
    usage?: "general" | "own"
  ) => {
    // Third-party only logic (fixed premiums by tonnage and usage type)
    if (coverage === "third-party") {
      let basePremiumTP = 0;
      const t = tonnageValue ?? 0;
      const isGeneral = usage === "general";

      if (t > 0 && t <= 3) {
        basePremiumTP = 7_500;
      } else if (t > 3 && t <= 8) {
        basePremiumTP = 10_000;
      } else if (t > 8 && t <= 15) {
        basePremiumTP = isGeneral ? 15_000 : 12_500;
      } else if (t > 15) {
        basePremiumTP = 20_000;
      } else {
        basePremiumTP = 0; // invalid tonnage
      }

      const stampDuty = 40;
      const trainingLevy = basePremiumTP * 0.002;
      const phcf = basePremiumTP * 0.0025;
      const policyCharge = 1000;
      const totalPremium = basePremiumTP + stampDuty + trainingLevy + phcf + policyCharge;

      return {
        basicPremium: basePremiumTP,
        premium: totalPremium,
        additionalCovers: { excessProtector: 0, politicalTerrorism: 0, courtesyCar: 0 },
        levies: { stampDuty, trainingLevy, phcf, policyCharge },
      };
    }

    // Comprehensive logic (fleet vs single)
    const rate = isFleet ? 0.0475 : 0.05;
    let basePremium = carValue * rate;
    if (basePremium < 50_000) basePremium = 50_000;

    // Add-ons: Excess protector free; PVT rule based on car value
    const excessProtectorCost = 0;
    let politicalTerrorismCost = 0;
    if (carValue > 5_000_000) {
      politicalTerrorismCost = Math.max(carValue * 0.0025, 2_500);
    } else {
      politicalTerrorismCost = 0;
    }
    const courtesyCarCost = 0;

    const totalBasicPremium = basePremium + politicalTerrorismCost + courtesyCarCost + excessProtectorCost;

    // levies
    const stampDuty = 40;
    const trainingLevy = totalBasicPremium * 0.002;
    const phcf = totalBasicPremium * 0.0025;
    const policyCharge = 1000;

    const totalPremium = totalBasicPremium + stampDuty + trainingLevy + phcf + policyCharge;

    return {
      basicPremium: basePremium,
      premium: totalPremium,
      additionalCovers: { excessProtector: excessProtectorCost, politicalTerrorism: politicalTerrorismCost, courtesyCar: courtesyCarCost },
      levies: { stampDuty, trainingLevy, phcf, policyCharge },
    };
  }, []);

  const calculatePremium = useCallback(() => {
    // Validation differs by calculator type and coverage
    if (calculatorType === "commercial" && commercialCoverageType === "third-party") {
      if (tonnage === "" || Number(tonnage) <= 0) {
        resetCalculator(false);
        return;
      }
    } else {
      if (carValue === "" || Number(carValue) <= 0 || Number(carValue) > MAX_CAR_VALUE) {
        resetCalculator(false);
        return;
      }
    }

    const numCarValue = Number(carValue || 0);
    let result;

    if (calculatorType === "private") {
      result = calculatePrivatePremium(numCarValue, coverageType, excessProtector, politicalTerrorismCover, courtesyCar);
    } else {
      result = calculateCommercialPremium(
        numCarValue,
        fleetType === "fleet",
        commercialCoverageType,
        typeof tonnage === "number" ? tonnage : Number(tonnage || 0),
        usageType
      );
    }

    setBasicPremium(result.basicPremium);
    setPremium(result.premium);
    setAdditionalCovers(result.additionalCovers);
    setLevies(result.levies);
  }, [carValue, calculatorType, coverageType, excessProtector, politicalTerrorismCover, courtesyCar, fleetType, commercialCoverageType, tonnage, usageType, calculatePrivatePremium, calculateCommercialPremium]);

  const isValidInput = useMemo(() => {
    if (calculatorType === "commercial" && commercialCoverageType === "third-party") {
      return tonnage !== "" && Number(tonnage) > 0;
    }
    return carValue !== "" && Number(carValue) > 0 && Number(carValue) <= MAX_CAR_VALUE;
  }, [calculatorType, commercialCoverageType, tonnage, carValue]);

  // Debounce effect for carValue calculation
  useEffect(() => {
    if (isValidInput) {
      const handler = setTimeout(() => {
        calculatePremium();
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [calculatePremium, isValidInput]);

  const resetCalculator = (resetInput = true) => {
    if (resetInput) {
      setCarValue("");
      setCarValueInput("");
    }
    setCoverageType("comprehensive");
    setCommercialCoverageType("comprehensive");
    setExcessProtector(false);
    setPoliticalTerrorismCover(false);
    setCourtesyCar("none");
    setFleetType("single");
    setTonnage("");
    setUsageType("general");
    setPremium(null);
    setAdditionalCovers({ excessProtector: 0, politicalTerrorism: 0, courtesyCar: 0 });
    setBasicPremium(null);
    setLevies({ stampDuty: 0, trainingLevy: 0, phcf: 0, policyCharge: 0 });
  };

  const coverageDescriptions: Record<string, string> = {
    comprehensive: "Full coverage: damage, fire, theft, and third-party liability.",
    "third-party": "Covers only damage or injury you cause to others.",
  };

  const handleCarValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // remove commas
    if (rawValue === "") {
      setCarValue("");
      setCarValueInput("");
      return;
    }
    const numericValue = Number(rawValue);
    if (numericValue >= 0 && numericValue <= MAX_CAR_VALUE) {
      setCarValue(numericValue);
      setCarValueInput(formatNumber(numericValue));
    }
  };

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
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">
            Vehicle Insurance Calculator
          </h1>

          {/** Calculator Type Selector */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Calculator Type
            </label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="privateVehicle"
                  name="calculatorType"
                  value="private"
                  checked={calculatorType === "private"}
                  onChange={(e) => setCalculatorType(e.target.value as "private" | "commercial")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="privateVehicle" className="ml-2 text-sm text-gray-700">
                  Private Vehicle
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="commercialVehicle"
                  name="calculatorType"
                  value="commercial"
                  checked={calculatorType === "commercial"}
                  onChange={(e) => setCalculatorType(e.target.value as "private" | "commercial")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="commercialVehicle" className="ml-2 text-sm text-gray-700">
                  Commercial Vehicle
                </label>
              </div>
            </div>
          </div>

          {/** Car Value */}
          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Car Value (KSh)
            </label>
            <input
              type="text"
              value={carValueInput}
              onChange={handleCarValueChange}
              placeholder="Enter car value"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 text-gray-900"
            />
            {carValue !== "" && Number(carValue) > MAX_CAR_VALUE && (
              <p className="text-red-500 text-xs mt-1">
                Maximum car value is {formatKES(MAX_CAR_VALUE)}
              </p>
            )}
          </div>

          {/** Commercial Vehicle Options */}
          {calculatorType === "commercial" && (
            <div className="mb-3 space-y-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Coverage Type
                </label>
                <select
                  value={commercialCoverageType}
                  onChange={(e) => setCommercialCoverageType(e.target.value as "comprehensive" | "third-party")}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                >
                  <option value="comprehensive">Comprehensive</option>
                  <option value="third-party">Third Party Only</option>
                </select>
              </div>

              {commercialCoverageType === "comprehensive" && (
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Fleet Type
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="singleVehicle"
                        name="fleetType"
                        value="single"
                        checked={fleetType === "single"}
                        onChange={(e) => setFleetType(e.target.value as "single" | "fleet")}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="singleVehicle" className="ml-2 text-sm text-gray-700">
                        Single Vehicle (5.0%)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="fleetVehicle"
                        name="fleetType"
                        value="fleet"
                        checked={fleetType === "fleet"}
                        onChange={(e) => setFleetType(e.target.value as "single" | "fleet")}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="fleetVehicle" className="ml-2 text-sm text-gray-700">
                        Fleet (3+) (4.75%)
                      </label>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 italic">
                    Inclusive of (Excess Protector and PVT)
                  </p>
                </div>
              )}

              {commercialCoverageType === "third-party" && (
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Vehicle Tonnage (tonnes)
                    </label>
                    <input
                      type="number"
                      value={tonnage}
                      onChange={(e) => setTonnage(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Enter tonnage"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 text-gray-900"
                      min={0}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Usage Type
                    </label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="usageGeneral"
                          name="usageType"
                          value="general"
                          checked={usageType === "general"}
                          onChange={(e) => setUsageType(e.target.value as "general" | "own")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="usageGeneral" className="ml-2 text-sm text-gray-700">
                          General Cartage
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="usageOwn"
                          name="usageType"
                          value="own"
                          checked={usageType === "own"}
                          onChange={(e) => setUsageType(e.target.value as "general" | "own")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="usageOwn" className="ml-2 text-sm text-gray-700">
                          Own Goods
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/** Private Vehicle Options */}
          {calculatorType === "private" && (
            <>
              {/** Coverage Type */}
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Coverage Type
                </label>
                <select
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                >
                  <option value="comprehensive">Comprehensive</option>
                  <option value="third-party">Third Party Only</option>
                </select>
                <p className="mt-1 text-xs text-gray-600 italic">
                  {coverageDescriptions[coverageType]}
                </p>
              </div>

              {/** Courtesy Car */}
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Courtesy Car
                </label>
                <div
                  className={`flex gap-4 ${
                    coverageType === "third-party" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="courtesyCarNone"
                      name="courtesyCar"
                      value="none"
                      checked={courtesyCar === "none"}
                      onChange={(e) =>
                        setCourtesyCar(e.target.value as "none" | "10days" | "20days")
                      }
                      disabled={coverageType === "third-party"}
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
                      onChange={(e) =>
                        setCourtesyCar(e.target.value as "none" | "10days" | "20days")
                      }
                      disabled={coverageType === "third-party"}
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
                      onChange={(e) =>
                        setCourtesyCar(e.target.value as "none" | "10days" | "20days")
                      }
                      disabled={coverageType === "third-party"}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                    />
                    <label htmlFor="courtesyCar20Days" className="ml-1 text-xs text-gray-700">
                      20 Days (+KSh 7,500)
                    </label>
                  </div>
                </div>
                {coverageType === "third-party" && (
                  <p className="text-xs text-gray-500 italic mt-1">
                    Not available for Third Party Only
                  </p>
                )}
              </div>
            </>
          )}

          {/** Additional Covers - Hidden for commercial third-party; disabled/checked for commercial comprehensive */}
          {!(calculatorType === "commercial" && commercialCoverageType === "third-party") && (
          <div className="mb-3">
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Additional Covers
            </label>
            <div
              className={`space-y-2 ${
                calculatorType === "commercial" || coverageType === "third-party"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="excessProtector"
                  checked={calculatorType === "commercial" ? true : excessProtector}
                  onChange={(e) => setExcessProtector(e.target.checked)}
                  disabled={calculatorType === "commercial" || coverageType === "third-party"}
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
                  checked={calculatorType === "commercial" ? true : politicalTerrorismCover}
                  onChange={(e) => setPoliticalTerrorismCover(e.target.checked)}
                  disabled={calculatorType === "commercial" || coverageType === "third-party"}
                  className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-1"
                />
                <label htmlFor="politicalTerrorismCover" className="ml-1 text-xs text-gray-700">
                  Political & Terrorism Cover (Free up to KSh 4,000,000, then 0.25%)
                </label>
              </div>
            </div>
            {calculatorType === "private" && coverageType === "third-party" && (
              <p className="text-xs text-gray-500 italic mt-1">
                Not available for Third Party Only
              </p>
            )}
          </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => resetCalculator()}
              className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/** Output Section */}
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200" id="output-card">
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-900">
            Premium Breakdown
          </h2>
          {premium === null ? (
            <p className="text-gray-700 text-center mt-4 text-sm">
              Enter details to see your premium.
            </p>
          ) : (
            <div className="space-y-3 text-gray-900">
              <div className="flex justify-between">
                <span>
                  Basic Premium
                  {calculatorType === "private" && coverageType === "comprehensive" && basicPremium! > 0 && carValue !== "" && (
                    <span className="text-gray-500 font-normal">
                      {" "}({((basicPremium! / Number(carValue)) * 100).toFixed(1)}% of Car Value)
                    </span>
                  )}
                  {calculatorType === "commercial" && commercialCoverageType === "comprehensive" && (
                    <span className="text-gray-500 font-normal">
                      {" "}({fleetType === "fleet" ? "4.75" : "5.0"}% of Car Value)
                    </span>
                  )}
                  :
                </span>
                <AnimatedValue value={formatKES(basicPremium!)} />
              </div>
              
              {/** Additional covers in breakdown */}
              {calculatorType === "private" && coverageType === "comprehensive" && (
                <>
                  <div className="flex justify-between">
                    <span>Excess Protector:</span>
                    <AnimatedValue
                      value={
                        additionalCovers.excessProtector
                          ? formatKES(additionalCovers.excessProtector)
                          : "KSh 0"
                      }
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>Political/Terrorism Cover:</span>
                    <AnimatedValue
                      value={
                        additionalCovers.politicalTerrorism
                          ? formatKES(additionalCovers.politicalTerrorism)
                          : "KSh 0"
                      }
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>Courtesy Car:</span>
                    <AnimatedValue
                      value={
                        additionalCovers.courtesyCar
                          ? formatKES(additionalCovers.courtesyCar)
                          : "KSh 0"
                      }
                    />
                  </div>
                </>
              )}

              {calculatorType === "commercial" && commercialCoverageType === "comprehensive" && (
                <>
                  <div className="flex justify-between">
                    <span>Excess Protector:</span>
                    <AnimatedValue value={"KSh 0"} />
                  </div>
                  <div className="flex justify-between">
                    <span>Political/Terrorism Cover:</span>
                    <AnimatedValue
                      value={
                        additionalCovers.politicalTerrorism
                          ? formatKES(additionalCovers.politicalTerrorism)
                          : "KSh 0"
                      }
                    />
                  </div>
                </>
              )}

              {/** Show total basic premium only if there are additional covers */}
              {(calculatorType === "private" && coverageType === "comprehensive" && 
                (additionalCovers.excessProtector > 0 || additionalCovers.politicalTerrorism > 0 || additionalCovers.courtesyCar > 0)) && (
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                  <span>Total Basic Premium:</span>
                  <AnimatedValue value={formatKES(basicPremium! + additionalCovers.excessProtector + additionalCovers.politicalTerrorism + additionalCovers.courtesyCar)} />
                </div>
              )}

              <div className="space-y-2">
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
