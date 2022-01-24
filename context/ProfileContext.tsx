import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import {
  Access,
  AddressData,
  DataType,
  db_acceptContactRequest,
  db_declineContactRequest,
  db_deleteContactInfo,
  db_getContact,
  db_saveContactInfo,
  db_sendContactRequest,
  db_changeContactAcccess,
  db_removeConnection,
  ContactType,
  SingleLineData,
  Request,
} from "../sdk/db";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/router";

export const ProfileContext = createContext<{
  profile: null | undefined | ContactType;
  // requests: Request[];
  declineContactRequest: (id: number) => Promise<void>;
  acceptContactRequest: (id: number, access: Access) => Promise<void>;
  sendContactRequest: (recipient_id: string) => Promise<void>;
  saveContactInfo: (
    data: SingleLineData | AddressData,
    type: DataType
  ) => Promise<void>;
  deleteContactInfo: (data_id: number, type: DataType) => Promise<void>;
  changeContactAccess: (
    owner_id: string,
    contact_id: string,
    access: Access
  ) => Promise<void>;
  removeConnection: (owner_id: string, contact_id: string) => Promise<void>;
  reloadData: () => Promise<void>;
}>(undefined as any);

export const ProfileWrapper = ({ children }: { children: JSX.Element }) => {
  // Data
  const user = useContext(AuthContext);
  const [profile, setProfile] = useState<null | undefined | ContactType>();
  const router = useRouter();

  // Initial data fetching
  useEffect(() => {
    user && reloadData();
  }, [user]);

  // Reload profile data
  const reloadData = async () => {
    if (user) {
      const { data, error } = await db_getContact(user.id);
      if (error) {
        if (error.message === "Not set up") router.push("setup");
        else console.log(error);
      } else {
        if (data) setProfile(data || null);
      }
    }
  };

  // Functions
  const declineContactRequest = async (id: number) => {
    await db_declineContactRequest(id);
    if (user) reloadData();
  };
  const acceptContactRequest = async (id: number, access: Access) => {
    const res = await db_acceptContactRequest(id, access);
    if (user) await reloadData();
  };
  const saveContactInfo = async (
    data: SingleLineData | AddressData,
    type: DataType
  ) => {
    if (user) {
      const saveRes = await db_saveContactInfo({
        uid: user.id,
        data: data,
        type: type,
      });
      if (saveRes.error) console.log(saveRes.error);
      await reloadData();
    }
  };
  const deleteContactInfo = async (data_id: number, type: DataType) => {
    if (user) {
      const saveRes = await db_deleteContactInfo(data_id, type);
      if (saveRes.error) console.log(saveRes.error);
      await reloadData();
    }
  };
  const sendContactRequest = async (recipient_id: string) => {
    if (user) {
      await db_sendContactRequest(user.id, recipient_id);
      console.log("1. Sent request");
      await reloadData();
      console.log("2. Reloaded Data");
    }
  };
  const changeContactAccess = async (
    owner_id: string,
    contact_id: string,
    access: Access
  ) => {
    await db_changeContactAcccess(owner_id, contact_id, access);
    await reloadData();
  };
  const removeConnection = async (owner_id: string, contact_id: string) => {
    await db_removeConnection(owner_id, contact_id);
    await reloadData();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        // requests,
        declineContactRequest,
        acceptContactRequest,
        saveContactInfo,
        deleteContactInfo,
        sendContactRequest,
        changeContactAccess,
        removeConnection,
        reloadData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
