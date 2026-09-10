// filter button labels
export const DietaryFilters = [
  "🌾 Gluten-Free",
  "🥛 Lactose-Free",
  "🥜 Nut-Free",
  "🦐 Shellfish-Free",
  "🥚 Egg-Free",
  "🫘 Soy-Free",
  "🧂 Low-Sodium",
  "🩺 Diabetic-Friendly",
  "❤️ Heart-Healthy",
  "🫘 Kidney-Friendly",
  "🪶 Low-FODMAP",
  "🌱 Vegan",
  "✡️ Kosher",
  "☪️ Halal",
  "👶 Kid-Friendly",
  "🌶️ Spice Sensitivity",
  "🫧 Texture-Based",
];

// used to properly trigger filters - add or remove ingredient boolean
export const inversionList = [
  "🌾 Gluten-Free",
  "🥛 Lactose-Free",
  "🥜 Nut-Free",
  "🦐 Shellfish-Free",
  "🥚 Egg-Free",
  "🫘 Soy-Free",
];

// Ingredient category groupings
export const Categories = [
  "Proteins",
  "Veggies",
  "Noodles",
  "Sauces",
  "Toppings",
];

// Map from button labels to booleans in json objects
export const filterMap = {
  "🌾 Gluten-Free": "hasGluten",
  "🥛 Lactose-Free": "hasLactose",
  "🥜 Nut-Free": "hasNuts",
  "🦐 Shellfish-Free": "hasShellfish",
  "🥚 Egg-Free": "hasEgg",
  "🫘 Soy-Free": "hasSoy",
  "🧂 Low-Sodium": "lowSodium",
  "🩺 Diabetic-Friendly": "diabeticFriendly",
  "❤️ Heart-Healthy": "heartHealthy",
  "🫘 Kidney-Friendly": "kidneyFriendly",
  "🪶 Low-FODMAP": "lowFodmap",
  "🌱 Vegan": "isVegan",
  "✡️ Kosher": "isKosher",
  "☪️ Halal": "isHalal",
  "👶 Kid-Friendly": "kidFriendly",
  "🌶️ Spice Sensitivity": "spiceSensitive",
  "🫧 Texture-Based": "textureFriendly",
};

// map from ingredient categories to json object formatting
export const categoryMap = {
  Proteins: "protein",
  Veggies: "veggie",
  Noodles: "noodle",
  Sauces: "sauce",
  Toppings: "topping",
};
