import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface CalorieCalculatorProps {
  height: number;
  currentWeight: number;
  targetWeight: number;
  targetDays: number;
}

const CalorieCalculator = ({ height, currentWeight, targetWeight, targetDays }: CalorieCalculatorProps) => {
  const [activityLevel, setActivityLevel] = useState([1.2]); // Default to sedentary

  // Calculate BMR using Harris-Benedict equation (for standard units)
  const calculateBMR = () => {
    // Converting weight to kg and height to cm for the formula
    const weightInKg = currentWeight * 0.453592;
    const heightInCm = height * 2.54;
    
    // BMR formula for adults
    const bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * 30 + 5; // Assuming age 30 for simplicity
    console.log("Calculated BMR:", bmr);
    return bmr;
  };

  const calculateDailyCalories = () => {
    const bmr = calculateBMR();
    const tdee = bmr * activityLevel[0];
    
    // Calculate required deficit for weight loss
    const weightToLose = currentWeight - targetWeight;
    const totalCaloriesNeeded = weightToLose * 3500; // 3500 calories per pound
    const dailyDeficit = totalCaloriesNeeded / targetDays;
    
    // Calculate target calories with deficit
    const targetCalories = tdee - dailyDeficit;
    
    console.log("TDEE:", tdee);
    console.log("Activity Level:", activityLevel[0]);
    console.log("Daily deficit needed:", dailyDeficit);
    console.log("Target daily calories:", targetCalories);
    
    return Math.max(1200, Math.round(targetCalories));
  };

  const calculateProteinNeeds = () => {
    // Adjust protein needs based on activity level
    // More active individuals need more protein
    const baseProteinMultiplier = activityLevel[0] >= 1.55 ? 1.0 : 0.8;
    const maxProteinMultiplier = activityLevel[0] >= 1.55 ? 1.4 : 1.2;
    
    const minProtein = Math.round(targetWeight * baseProteinMultiplier);
    const maxProtein = Math.round(targetWeight * maxProteinMultiplier);
    
    return { minProtein, maxProtein };
  };

  const getActivityLevelLabel = (level: number) => {
    if (level <= 1.2) return "Sedentary (little or no exercise)";
    if (level <= 1.375) return "Lightly active (exercise 1-3 times/week)";
    if (level <= 1.55) return "Moderately active (exercise 3-5 times/week)";
    if (level <= 1.725) return "Very active (exercise 6-7 times/week)";
    return "Extra active (very intense exercise daily)";
  };

  const dailyCalories = calculateDailyCalories();
  const weightLossPerWeek = ((currentWeight - targetWeight) / targetDays) * 7;
  const { minProtein, maxProtein } = calculateProteinNeeds();

  return (
    <Card className="p-6 w-full max-w-md mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Calorie Analysis</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Activity Level</label>
        <Slider
          value={activityLevel}
          onValueChange={setActivityLevel}
          min={1.2}
          max={1.9}
          step={0.025}
          className="mb-2"
        />
        <p className="text-sm text-muted-foreground">
          {getActivityLevelLabel(activityLevel[0])}
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Recommended Daily Calories:
            <span className="block text-2xl text-green-600">{dailyCalories} calories</span>
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">
            Daily Protein Target:
            <span className="block text-2xl text-blue-600">{minProtein}-{maxProtein}g</span>
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-center">
            To reach your goal weight of {targetWeight} lbs in {targetDays} days, you should aim to lose approximately{" "}
            <span className="font-semibold">{weightLossPerWeek.toFixed(1)} lbs per week</span>
          </p>
        </div>

        <div className="text-xs text-gray-500 text-center mt-2">
          * Adjust your intake based on how you feel and your progress. These are general guidelines.
        </div>
      </div>
    </Card>
  );
};

export default CalorieCalculator;