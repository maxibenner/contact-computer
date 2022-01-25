import { makeId } from "../utils/makeId";
import { supabase } from "./supabase";

export const db_getContactSearchResult = async (query: string) => {
  console.log(query);
  return await supabase.rpc("get_contacts_by_name", {
    query: query,
  });
};

// GET CONTACT
export const db_getContact = async (id: string) => {
  // Get profile
  const profilePromise: Promise<ContactType> = new Promise(
    async (resolve, reject) => {
      const { data, error } = await supabase
        .from("profile")
        .select(
          "id, name, surname, img_src, phone (*), email (*), web(*), address(*), requests_received:request!recipient_id(*,owner:owner_id(*)),requests_sent:request!owner_id(*,owner:owner_id(*)), followers:connection!owner_id(contact:contact_id(*), owner:owner_id(*), access), following:connection!contact_id(contact:contact_id(*), owner:owner_id(*), access)"
        )
        .eq("id", id)
        .limit(1)
        .single();

      if (error) {
        if (error.code === "406") {
          console.log(error);
          reject("Not set up");
        } else {
          console.log(error);
          reject("Problem with profile");
        }
      } else resolve(data);
    }
  );

  // Get connections
  const contactPromise: Promise<{
    follows_contact: {
      contact: { id: string };
      owner: { id: string };
      access: Access;
    }[];
    contact_follows: {
      contact: { id: string };
      owner: { id: string };
      access: Access;
    }[];
  }> = new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("profile")
      .select(
        "follows_contact:connection!owner_id(contact:contact_id(*), owner:owner_id(*), access), contact_follows:connection!contact_id(contact:contact_id(*), owner:owner_id(*), access)"
      )
      .eq("id", id)
      .single();

    if (error) reject("Problem with contacts");
    else resolve(data);
  });

  return await Promise.all([profilePromise, contactPromise])
    .then(([profileRes, contactRes]) => {
      let contactsObj = <{ [key: string]: TransformedConnectionType }>{};
      let contactsArr = <TransformedConnectionType[]>[];

      // Copy data
      const follows_contact = contactRes.follows_contact;
      const contact_follows = contactRes.contact_follows;

      follows_contact.map((follower) => {
        const key = follower.contact.id;
        return (contactsObj[key] = <TransformedConnectionType>{
          contact: follower.contact,
          access: follower.access,
          follows_contact: true,
          contact_follows: false,
        });
      });

      contact_follows.forEach((contact) => {
        const key = contact.owner.id;
        if (contactsObj[key]) {
          contactsObj[key] = {
            ...contactsObj[key],
            contact_follows: true,
            access: contact.access,
          };
        } else {
          contactsObj[key] = <TransformedConnectionType>{
            contact: contact.owner,
            access: contact.access,
            follows_contact: false,
            contact_follows: true,
          };
        }
      });

      contactsArr = Object.values<TransformedConnectionType>(contactsObj);

      return {
        data: { ...profileRes, contact: contactsArr },
        error: null,
      };
    })
    .catch((err) => {
      console.log(err);
      return { data: null, error: { message: "Not set up" } };
    });
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
  return await supabase.from(type).upsert([data]);
};

// DELETE
export const db_deleteContactInfo = async (data_id: number, type: DataType) =>
  await supabase.from(type).delete().eq("id", data_id);

// SEND CONTACT REQUEST
export const db_sendContactRequest = (owner_id: string, recipient_id: string) =>
  supabase
    .from("request")
    .insert([{ owner_id: owner_id, recipient_id: recipient_id }]);

/**
 * Accept contact request and set access
 *
 * Prerequisites:
 * - User needs to be authenticated
 * - User needs to be recipient of request
 *
 * @param id - Primary key of request
 * @param access - The access level the contact will have on the user's data
 */
export const db_acceptContactRequest = async (id: number, access: Access) => {
  // Delete request
  const { data, error } = await supabase
    .from("request")
    .delete({ returning: "representation" })
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    return { data: null, error: { code: "400", message: error.message } };
  }

  // Add connection
  if (data as Request) {
    const connectionRes = await supabase.from("connection").insert({
      owner_id: data.recipient_id,
      contact_id: data.owner_id,
      access: access,
    });
    if (connectionRes.error)
      return {
        data: null,
        error: {
          code: connectionRes.error.code,
          message: connectionRes.error.message,
        },
      };
    else
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
 * @param access - New access type
 */
export const db_changeContactAcccess = async (
  owner_id: string,
  contact_id: string,
  access: Access
) => {
  console.log(access);
  const { data, error } = await supabase
    .from("connection")
    .update([{ access: access }])
    .eq("owner_id", owner_id)
    .eq("contact_id", contact_id);

  console.log(data, error);
};

/**
 * Remove connection
 *
 * Prerequisites:
 * - User needs to be authenticated
 * - User needs to be either owner or contact of the connection
 *
 * @param owner_id - Uid of user
 * @param contact_id - Uid of contact
 * @param access - New access type
 */
export const db_removeConnection = async (
  owner_id: string,
  contact_id: string
) => {
  const { data, error } = await supabase
    .from("connection")
    .delete()
    .eq("owner_id", owner_id)
    .eq("contact_id", contact_id);
  console.log(error);
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
    console.log(profileRes.error);
    return { data: null, error: { message: "Problem reading user profile" } };
  }

  const deleteRes = await supabase.storage
    .from("public")
    .remove([profileRes.data.img_src]);

  if (deleteRes.error && !deleteRes.data) {
    console.log(deleteRes.error);
    return {
      data: null,
      error: { message: "Problem deleting old profile image" },
    };
  }

  const fingerprint = makeId(6);
  const path = `${uid}/profile_image_${fingerprint}`;
  const uploadRes = await supabase.storage.from("public").upload(path, image);

  if (uploadRes.error) {
    console.log(uploadRes.error);
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
    console.log(updateRes.error);
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
  access: Access;
  owner_id: string;
};
export type AddressData = {
  id: number | string | undefined | null;
  label: string;
  access: Access;
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
  access: Access;
};
export type TransformedConnectionType = {
  contact: {
    id: string;
    name: string;
    surname: string;
    img_src: string;
  };
  follows_contact: boolean;
  contact_follows: boolean;
  access: Access;
};
export type DataType = "phone" | "email" | "web" | "address";
export type Access = "public" | "contacts" | "friends";
export type Relationship =
  | "full"
  | "follower"
  | "following"
  | "requesting"
  | "none"
  | "self"
  | undefined;
