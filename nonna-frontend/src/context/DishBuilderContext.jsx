import { createContext, useContext } from "react";
import useDishBuilder from "../hooks/useDishBuilder";

const DishBuilderContext = createContext(null);

export function DishBuilderProvider({ children }) {
  const value = useDishBuilder();

  return (
    <DishBuilderContext.Provider value={value}>
      {children}
    </DishBuilderContext.Provider>
  );
}

export function useDishBuilderContext() {
  const context = useContext(DishBuilderContext);

  if (!context) {
    throw new Error("useDishBuilderContext must be used within DishBuilderProvider");
  }

  return context;
}
