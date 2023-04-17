import React, { useState } from "react";
import { createContext } from "react";

interface Entity<T> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
}

interface Context {
  accessToken: Entity<string>;
  encryptionKey: Entity<string>;
}

const DEFAULT_CONTEXT: Context = {
  accessToken: {
    value: "",
    setValue: () => null,
  },
  encryptionKey: {
    value: "",
    setValue: () => null,
  },
};

function useProvider<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  return {
    value,
    setValue,
  };
}

export const AppContext = createContext<Context>(DEFAULT_CONTEXT);

export const ContextProvider = (props: { children: React.ReactNode }) => {
  const accessToken = useProvider("");
  const encryptionKey = useProvider("");

  var providers: Context = {
    accessToken,
    encryptionKey,
  };

  return <AppContext.Provider value={providers}>{props.children}</AppContext.Provider>;
};
