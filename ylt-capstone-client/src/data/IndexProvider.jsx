import React, { createContext } from "react";
import { indexStore } from "./IndexStore";

export const IndexContext = createContext(indexStore);

export const IndexProvider = ({ children }) => {
  return (
    <IndexContext.Provider value={indexStore}>{children}</IndexContext.Provider>
  );
};
