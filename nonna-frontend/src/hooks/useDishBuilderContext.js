import { useContext } from "react";
// import { DishBuilderContext } from "../context/DishBuilderContext";
import { DishBuilderContext } from "../context/DishBuilderContextObject";



export default function useDishBuilderContext() {
  const context = useContext(DishBuilderContext);

  if (!context) {
    throw new Error("useDishBuilderContext must be used within DishBuilderProvider");
  }

  return context;
}
