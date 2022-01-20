import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getContact } from "../sdk/db";
import { ContactType } from "../sdk/db";

export const ProfileContext = createContext<null | undefined | ContactType>(
  undefined
);

export const ProfileWrapper = ({ children }: { children: JSX.Element }) => {
  const user = useContext(AuthContext);
  const [profile, setProfile] = useState<null | undefined | ContactType>();

  useEffect(() => {
    if (user) {
      getContact(user.id).then(({ data, error }) => {
        if (data) setProfile(data);
        if (error) console.log(error);
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};
