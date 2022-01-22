import { supabase } from "./supabase";

export const db_getContactSearchResult = async (query: string) => {
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

      if (error) reject();
      else resolve(data);
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

    if (error) reject();
    else resolve(data);
  });

  const [profileRes, contactRes] = await Promise.all([
    profilePromise,
    contactPromise,
  ]);

  let contactsObj = <{ [key: string]: TransformedConnectionType }>{};
  let contactsArr = <TransformedConnectionType[]>[];

  if (contactRes) {
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
        contactsObj[key] = { ...contactsObj[key], follows_contact: true };
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
  }

  return {
    data: { ...profileRes, contact: contactsArr },
    error: null,
  };
  // })
  // .catch((err) => {
  //   return {
  //     data: null,
  //     error: err.message,
  //   };
  // });
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
  | null;
