import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AddressData,
  DataType,
  db_acceptContactRequest,
  db_declineContactRequest,
  db_deleteContactInfo,
  db_getContact,
  db_saveContactInfo,
  db_sendContactRequest,
  db_removeConnection,
  db_updateProfileImage,
  ContactType,
  SingleLineData,
} from "../sdk/db";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/router";
import { NotificationContext } from "./NotificationContext";

export const ProfileContext = createContext<{
  profile: null | undefined | ContactType;
  declineContactRequest: (id: number) => Promise<void>;
  acceptContactRequest: (sender_id: string) => Promise<void>;
  sendContactRequest: (recipient_id: string) => Promise<void>;
  saveContactInfo: (
    data: SingleLineData | AddressData,
    type: DataType
  ) => Promise<void>;
  deleteContactInfo: (data_id: number, type: DataType) => Promise<void>;
  removeConnection: (id: number) => Promise<void>;
  updateProfileImage: (file: File) => Promise<void>;
  reloadData: () => Promise<void>;
}>(undefined as any);

export const ProfileWrapper = ({ children }: { children: JSX.Element }) => {
  // Data
  const user = useContext(AuthContext);
  const [notification, setNotification] = useContext(NotificationContext);
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
  const acceptContactRequest = async (sender_id: string) => {
    if (user) {
      await db_acceptContactRequest(user.id, sender_id);
      await reloadData();
    }
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
      await reloadData();
    }
  };

  const removeConnection = async (id: number) => {
    await db_removeConnection(id);
    await reloadData();
  };
  const updateProfileImage = async (file: File) => {
    if (!user) return;
    if (file.size >= 5000000) {
      return setNotification({
        title: "Warning",
        description: `Your selected image has a file size of ${(
          file.size / 1000000
        ).toFixed(0)} Mb. Please keep it under 5 MB.`,
        type: "error",
        buttonText: "Ok",
      });
    }
    await db_updateProfileImage(user.id, file);
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
        removeConnection,
        reloadData,
        updateProfileImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
