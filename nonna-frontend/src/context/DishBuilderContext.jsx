import {React, createContext} from "react";
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
