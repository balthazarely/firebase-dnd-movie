import { createContext } from "react";

const defaultValues = {
  user: null,
};

export const UserContext = createContext(defaultValues);
