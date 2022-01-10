import React, { createContext, useState, useEffect } from "react";

export const FieldsContext = createContext<any>({} as any);

export const FieldsWrapper = ({ children }: { children: React.ReactNode }) => {
  const [fields, setFields] = useState<Field[]>([]);

  const addField = ({ name, categorie, value, access }: Field) => {
    const newField = {
      name: name,
      categorie: categorie,
      value: value,
      access: access,
    };
    setFields([...fields, newField]);
  };

  // Get data from local storage and return it
  useEffect(() => {
    const localData = localStorage.getItem("data");
    if (localData) setFields(JSON.parse(localData));
  }, []);

  return (
    <FieldsContext.Provider value={{ fields, addField }}>
      {children}
    </FieldsContext.Provider>
  );
};

export interface Field {
  name: string;
  categorie: "phone" | "email" | "address";
  value: string;
  access: "public" | "contacts" | "friends";
}
