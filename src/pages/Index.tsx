import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BMICalculator from "@/components/BMICalculator";
import WeightTracker from "@/components/WeightTracker";
import MealPlan from "@/components/MealPlan";
import CalorieCalculator from "@/components/CalorieCalculator";
import AuthForm from "@/components/auth/AuthForm";

const Index = () => {
  const [userMetrics, setUserMetrics] = useState({
    height: 0,
    currentWeight: 0,
    targetWeight: 0,
    targetDays: 0,
  });
  const [recommendedCalories, setRecommendedCalories] = useState(1200);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBMICalculated = (bmi: number) => {
    console.log("BMI calculated:", bmi);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col">
      <div className="container mx-auto px-4 flex-grow">
        <img 
          src="/lovable-uploads/67003c76-1908-4b2f-93d3-01ea4a4cf510.png" 
          alt="MyMealPlan Logo" 
          className="mx-auto mb-6 h-24 w-auto"
        />
        <h1 className="text-4xl font-bold text-center mb-4">
          MyMealPlan.App
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
          Track your weight loss journey, calculate your recommended daily calorie and protein intake, and get a custom meal plan designed to meet your goals.
        </p>

        {!session && (
          <div className="mb-12 bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sign Up for Free</h2>
              <p className="text-gray-600 mt-2">
                Create an account to unlock all features including weight tracking, BMI calculation, and personalized meal plans.
              </p>
            </div>
            <AuthForm />
          </div>
        )}

        <div className="mt-8">
          <MealPlan dailyCalories={recommendedCalories} />
        </div>

        {session && (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div>
                <BMICalculator 
                  onBMICalculated={handleBMICalculated}
                  onMetricsUpdate={(height, weight) => {
                    setUserMetrics(prev => ({
                      ...prev,
                      height,
                      currentWeight: weight
                    }));
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <WeightTracker
                  onGoalSet={(weight, days) => {
                    setUserMetrics(prev => ({
                      ...prev,
                      targetWeight: weight,
                      targetDays: days
                    }));
                  }}
                />
              </div>
            </div>
            {userMetrics.height > 0 && userMetrics.targetWeight > 0 && (
              <div className="mt-8">
                <CalorieCalculator 
                  {...userMetrics} 
                  onCaloriesCalculated={(calories: number) => {
                    console.log("Setting recommended calories:", calories);
                    setRecommendedCalories(calories);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;