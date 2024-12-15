import { Meal } from "../../../types";

export const sandwichLunchRecipes: Meal[] = [
  {
    name: "Caprese Sandwich",
    calories: 450,
    protein: 20,
    carbs: 48,
    fat: 22,
    recipe: {
      ingredients: [
        "2 slices sourdough bread (220 cal)",
        "4 oz fresh mozzarella (280 cal)",
        "2 medium tomatoes (44 cal)",
        "1 cup fresh basil leaves (1 cal)",
        "2 tbsp balsamic glaze (40 cal)",
        "1 tbsp olive oil (120 cal)"
      ],
      instructions: [
        "Slice tomatoes into 1/4 inch thick rounds",
        "Slice mozzarella into 1/4 inch thick slices",
        "Wash and dry basil leaves",
        "Lightly toast sourdough bread slices",
        "Drizzle olive oil on both inner sides of bread",
        "Layer mozzarella slices on one piece of bread",
        "Add tomato slices on top of mozzarella",
        "Place basil leaves over tomatoes",
        "Drizzle with balsamic glaze",
        "Close sandwich with other bread slice",
        "Cut diagonally and serve immediately"
      ],
      prepTime: "10 minutes",
      cookTime: "5 minutes"
    }
  },
  {
    name: "Tuna Melt",
    calories: 520,
    protein: 35,
    carbs: 45,
    fat: 25,
    recipe: {
      ingredients: [
        "2 slices sourdough bread (220 cal)",
        "1 can tuna in water (120 cal)",
        "2 tbsp mayo (180 cal)",
        "1/4 cup diced celery (4 cal)",
        "2 slices cheddar cheese (220 cal)",
        "1 medium tomato (22 cal)"
      ],
      instructions: [
        "Drain tuna well and place in a mixing bowl",
        "Mix tuna with mayo and diced celery",
        "Season with salt and pepper to taste",
        "Toast bread slices until lightly golden",
        "Spread tuna mixture on one slice of bread",
        "Top with tomato slices and cheddar cheese",
        "Place under broiler for 2-3 minutes until cheese melts",
        "Top with second slice of bread and serve immediately"
      ],
      prepTime: "10 minutes",
      cookTime: "5 minutes"
    }
  },
  {
    name: "Grilled Chicken Pesto",
    calories: 550,
    protein: 40,
    carbs: 45,
    fat: 28,
    recipe: {
      ingredients: [
        "2 slices ciabatta bread (220 cal)",
        "5 oz grilled chicken breast (150 cal)",
        "2 tbsp pesto (160 cal)",
        "1 oz fresh mozzarella (80 cal)",
        "1 roasted red pepper (15 cal)",
        "1 cup arugula (5 cal)"
      ],
      instructions: [
        "Season chicken breast with salt and pepper",
        "Grill chicken for 6-7 minutes per side until cooked through",
        "Let chicken rest for 5 minutes, then slice",
        "Slice ciabatta bread and lightly toast",
        "Spread pesto on both inner sides of bread",
        "Layer sliced chicken on bottom piece",
        "Add sliced mozzarella and roasted red pepper",
        "Top with fresh arugula",
        "Close sandwich and serve"
      ],
      prepTime: "15 minutes",
      cookTime: "15 minutes"
    }
  }
];