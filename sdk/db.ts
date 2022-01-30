import { makeId } from "../utils/makeId";
import { supabase } from "./supabase";

export const db_getContactSearchResult = async (query: string) => {
  return await supabase.rpc("get_contacts_by_name", {
    query: query,
  });
};

// GET CONTACT
export const db_getContact = async (id: string) => {
  // Get profile with scrambled connections
  const { data, error } = await supabase
    .from("profile")
    .select(
      "id, name, surname, img_src, phone (*), email (*), web(*), address(*), requests_received:request!recipient_id(*,owner:sender_id(*)),requests_sent:request!sender_id(*,owner:sender_id(*)), contact_o:connection!owner_id(data:contact_id(*), id), contact_r:connection!contact_id(data:owner_id(*), id)"
    )
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    if (
      error.code === "406" ||
      error.message === "JSON object requested, multiple (or no) rows returned"
    ) {
      // Not set up
      return {
        data: data,
        error: { message: "Not set up" },
      };
    } else {
      return {
        data: data,
        error: error,
      };
    }
  } else {
    // Merge contacts
    const contacts = [...data.contact_o, ...data.contact_r];

    // Update profile object
    const newData = {
      address: data.address,
      contact: contacts,
      email: data.email,
      id: data.id,
      img_src: data.img_src,
      name: data.name,
      phone: data.phone,
      requests_received: data.requests_received,
      requests_sent: data.requests_sent,
      surname: data.surname,
      web: data.web,
    };

    return {
      data: newData,
      error: null,
    };
  }
};

// SAVE
export const db_saveContactInfo = async ({
  data,
  type,
  uid,
}: {
  data: SingleLineData | AddressData;
  type: "phone" | "email" | "web" | "address";
  uid: string;
}) => {
  // User primary key of already existing data or remove key for auto generation for new data
  data.owner_id = uid;
  if (typeof data.id === "string") {
    if (data.id.includes("local")) data.id = undefined;
  }
  const saveRes = await supabase.from(type).upsert([data]);
  if (saveRes.error) console.log(saveRes.error);
  return { data: saveRes.data, error: saveRes.error };
};

// DELETE
export const db_deleteContactInfo = async (data_id: number, type: DataType) =>
  await supabase.from(type).delete().eq("id", data_id);

// SEND CONTACT REQUEST
export const db_sendContactRequest = async (
  owner_id: string,
  recipient_id: string
) => {
  const { data, error } = await supabase
    .from("request")
    .insert([{ sender_id: owner_id, recipient_id: recipient_id }]);

  if (error) console.log(error);
  return { data, error };
};

/**
 * Accept contact request
 *
 * Prerequisites:
 * - User needs to be authenticated
 * - User needs to be recipient of request
 *
 * @param id - Primary key of request
 */
export const db_acceptContactRequest = async (
  recipient_id: string,
  owner_id: string
) => {
  console.log(recipient_id)
  // Add connection
  const connectionRes = await supabase.from("connection").insert({
    owner_id: recipient_id,
    contact_id: owner_id
  });
  if (connectionRes.error) {
    console.log(connectionRes.error);
    return {
      data: null,
      error: {
        code: connectionRes.error.code,
        message: connectionRes.error.message,
      },
    };
  } else {
    // Delete request
    const { data, error } = await supabase
      .from("request")
      .delete({ returning: "representation" })
      .eq("recipient_id", recipient_id)
      .limit(1)
      .single();

    if (error) {
      console.log(error);
      return { data: null, error: { code: "400", message: error.message } };
    }
    return {
      data: connectionRes.data as any,
      error: null,
    };
  }
};

/**
 * Decline contact request
 *
 * Prerequisites:
 * - User needs to be authenticated
 * - User needs to be recipient of request
 *
 * @param id - Primary key of request
 */
export const db_declineContactRequest = async (id: number) => {
  return await supabase.from("request").delete().eq("id", id);
};

/**
 * Change contact access
 *
 * Prerequisites:
 * - User needs to be authenticated
 * - User needs to be recipient of request
 *
 * @param owner_id - Uid of user
 * @param contact_id - Uid of contact
 * @param is_private - New access type
 */
export const db_changeContactAcccess = async (
  owner_id: string,
  contact_id: string,
  is_private: boolean
) => {
  const { data, error } = await supabase
    .from("connection")
    .update([{ is_private: is_private }])
    .eq("owner_id", owner_id)
    .eq("contact_id", contact_id);
};

/**
 * Remove connection
 *
 * Prerequisites:
 * - User needs to be authenticated
 * - User needs to be either owner or contact of the connection
 *
 * @param id - Id of connection
 */
export const db_removeConnection = async (id: number) => {
  const { data, error } = await supabase
    .from("connection")
    .delete()
    .eq("id", id);
};

/**
 * Update profile image
 *
 * Prerequisites:
 * - User needs to be authenticated
 *
 * @param uid - Id of uploading user
 * @param image - The image file to be uploaded
 */
export const db_updateProfileImage = async (uid: string, image: File) => {
  const profileRes = await supabase
    .from("profile")
    .select("img_src")
    .eq("id", uid)
    .limit(1)
    .single();

  if (profileRes.error && !profileRes.data) {
    return { data: null, error: { message: "Problem reading user profile" } };
  }

  const deleteRes = await supabase.storage
    .from("public")
    .remove([profileRes.data.img_src]);

  if (deleteRes.error && !deleteRes.data) {
    return {
      data: null,
      error: { message: "Problem deleting old profile image" },
    };
  }

  const fingerprint = makeId(6);
  const path = `${uid}/profile_image_${fingerprint}`;
  const uploadRes = await supabase.storage.from("public").upload(path, image);

  if (uploadRes.error) {
    return {
      data: null,
      error: { message: "Problem uploading new profile image" },
    };
  }

  const newImgPath = `https://${process.env.NEXT_PUBLIC_PROJECT_ID}.supabase.in/storage/v1/object/public/public/${uid}/profile_image_${fingerprint}`;
  const updateRes = await supabase
    .from("profile")
    .update({ img_src: newImgPath })
    .eq("id", uid)
    .limit(1)
    .single();

  if (updateRes.error) {
    return {
      data: null,
      error: { message: "Problem update profile" },
    };
  }
  return { data: updateRes.data, error: null };
};

/* __________________TYPES__________________ */
export type ContactType = {
  id: string;
  name: string;
  surname: string;
  img_src: string;
  phone: SingleLineData[];
  email: SingleLineData[];
  web: SingleLineData[];
  address: AddressData[];
  contact: TransformedConnectionType[];
  requests_received: Request[];
  requests_sent: Request[];
};
export type SingleLineData = {
  id: number | string | undefined | null;
  label: string;
  value: string;
  is_private: boolean;
  owner_id: string;
};
export type AddressData = {
  id: number | string | undefined | null;
  label: string;
  is_private: boolean;
  street: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  owner_id: string;
};
export type Request = {
  id: number;
  owner: {
    id: string;
    name: string;
    surname: string;
    img_src: string;
  };
  recipient_id: string;
  sender_id: string;
};
export type Connection = {
  owner: {
    id: string;
    name: string;
    surname: string;
    img_src: string;
  };
  contact: {
    id: string;
    name: string;
    surname: string;
    img_src: string;
  };
  is_private: boolean;
};
export type TransformedConnectionType = {
  data: {
    id: string;
    name: string;
    surname: string;
    img_src: string;
  };
  id: number;
};
export type DataType = "phone" | "email" | "web" | "address";
export type Relationship =
  | "full"
  | "request received"
  | "request sent"
  | "none"
  | "self"
  | undefined;
