import { Coffee, Utensils, Cake, Wine, Scissors, Flower2, ShoppingBag, Dumbbell, PawPrint, Sparkles, LucideIcon } from "lucide-react";

export const getBusinessIcon = (businessType: string): LucideIcon => {
  switch (businessType) {
    case "cafeteria": return Coffee;
    case "restaurante": return Utensils;
    case "panaderia": return Cake;
    case "bar": return Wine;
    case "salon": return Scissors;
    case "belleza": return Flower2;
    case "tienda": return ShoppingBag;
    case "fitness": return Dumbbell;
    case "mascotas": return PawPrint;
    default: return Sparkles;
  }
};
