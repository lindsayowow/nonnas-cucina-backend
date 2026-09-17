import { DishBuilderContext } from "./DishBuilderContextObject";

import useDishBuilder from "../hooks/useDishBuilder";

export function DishBuilderProvider({ children }) {
  const value = useDishBuilder();

  return (
    <DishBuilderContext.Provider value={value}>
      {children}
    </DishBuilderContext.Provider>
  );
}
