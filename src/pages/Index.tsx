import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthForm from "@/components/auth/AuthForm";
import DashboardContent from "@/components/dashboard/DashboardContent";
import MetricsPrompt from "@/components/dashboard/MetricsPrompt";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Index = () => {
  const [userMetrics, setUserMetrics] = useState({
    height: 0,
    currentWeight: 0,
    targetWeight: 0,
    targetDays: 0,
    gender: undefined as "male" | "female" | undefined,
  });
  
  const [recommendedCalories, setRecommendedCalories] = useState(1200);
  const [session, setSession] = useState<any>(null);
  const [hasMetrics, setHasMetrics] = useState(false);
  const [lastSavedMetrics, setLastSavedMetrics] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserMetrics(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserMetrics(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserMetrics = async (userId: string) => {
    try {
      console.log('Loading user metrics for user:', userId);
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading user metrics:', error);
        return;
      }

      if (data) {
        console.log('Loaded user metrics:', data);
        setUserMetrics({
          height: data.height || 0,
          currentWeight: data.current_weight || 0,
          targetWeight: data.target_weight || 0,
          targetDays: data.target_days || 0,
          gender: data.gender,
        });
        setRecommendedCalories(data.recommended_calories || 1200);
        setHasMetrics(true);
        // Store the last saved state
        setLastSavedMetrics(JSON.stringify({
          height: data.height,
          current_weight: data.current_weight,
          target_weight: data.target_weight,
          target_days: data.target_days,
          recommended_calories: data.recommended_calories,
          gender: data.gender,
        }));
      }
    } catch (err) {
      console.error('Exception while loading metrics:', err);
    }
  };

  const saveUserMetrics = async () => {
    if (!session?.user) {
      toast.error("Please log in to save your metrics");
      return;
    }

    const currentMetrics = {
      height: userMetrics.height,
      current_weight: userMetrics.currentWeight,
      target_weight: userMetrics.targetWeight,
      target_days: userMetrics.targetDays,
      recommended_calories: recommendedCalories,
    };

    // Check if metrics have actually changed
    if (JSON.stringify(currentMetrics) === lastSavedMetrics) {
      console.log('Metrics unchanged, skipping save');
      return;
    }

    console.log('Attempting to save user metrics:', {
      user_id: session.user.id,
      ...currentMetrics,
    });

    try {
      const { error } = await supabase
        .from('user_metrics')
        .upsert({
          user_id: session.user.id,
          height: userMetrics.height || 0,
          current_weight: userMetrics.currentWeight || 0,
          target_weight: userMetrics.targetWeight || 0,
          target_days: userMetrics.targetDays || 0,
          recommended_calories: recommendedCalories || 1200,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving user metrics:', error);
        toast.error("Failed to save your metrics");
        return;
      }

      console.log('Successfully saved user metrics');
      toast.success("Your metrics have been saved");
      setHasMetrics(true);
      setLastSavedMetrics(JSON.stringify(currentMetrics));
      
      // Reload metrics after saving to ensure we have the latest data
      loadUserMetrics(session.user.id);
    } catch (err) {
      console.error('Exception while saving metrics:', err);
      toast.error("An unexpected error occurred while saving your metrics");
    }
  };

  if (!session) {
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

          <div className="mb-12 bg-white rounded-lg shadow-md p-6">
            <AuthForm />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

        {!hasMetrics && <MetricsPrompt />}
        
        <div className="mt-8">
          <DashboardContent
            userMetrics={userMetrics}
            recommendedCalories={recommendedCalories}
            hasMetrics={hasMetrics}
            onMetricsUpdate={(height, weight) => {
              setUserMetrics(prev => ({
                ...prev,
                height,
                currentWeight: weight
              }));
              saveUserMetrics();
            }}
            onGoalSet={(weight, days) => {
              setUserMetrics(prev => ({
                ...prev,
                targetWeight: weight,
                targetDays: days
              }));
              saveUserMetrics();
            }}
            onCaloriesCalculated={(calories: number) => {
              console.log("Setting recommended calories:", calories);
              setRecommendedCalories(calories);
              saveUserMetrics();
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
