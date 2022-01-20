import { userInfo } from "os";
import { supabase } from "./supabase";

export const getContactSearchResult = async (query: string) => {
  return await supabase.rpc("get_contacts_by_name", {
    query: query,
  });
};

export const getContact = async (id: string) => {
  const { data, error } = (await supabase
    .from("profile")
    .select(
      "id, name, surname, img_src, phone (*), email (*), web(*), address(*), request!recipient_id(*,owner:owner_id(*)), connection!owner_id(*)"
    )
    .eq("id", id)
    .limit(1)
    .single()) as { data: ContactType; error: any };

  return { data, error };
};

export const saveContactInfo = async ({
  data,
  type,
}: {
  data: SingleLineData | AddressData;
  type: "phone" | "email" | "web" | "address";
}) => {
  return await supabase.from(type).upsert([data]);
};

export const deleteContactInfo = async ({
  data,
  type,
}: {
  data: SingleLineData | AddressData;
  type: "phone" | "email" | "web" | "address";
}) => {
  return await supabase.from(type).delete().eq("id", data.id);
};

export const sendContactRequest = async ({
  owner_id,
  recipient_id,
}: {
  owner_id: string;
  recipient_id: string;
}) => {
  return supabase
    .from("request")
    .insert([{ owner_id: owner_id, recipient_id: recipient_id }]);
};

export const acceptContactRequest = () => {};
export const declineContactRequest = () => {};

/* __________________TYPES__________________ */
export type ContactType = {
  id?: string;
  name: string;
  surname: string;
  img_src: string;
  phone: SingleLineData[];
  email: SingleLineData[];
  web: SingleLineData[];
  address: AddressData[];
  connection: ConnectionData[];
  request: RequestData[];
};
export type SingleLineData = {
  id?: number | string | null;
  label: string;
  value: string;
  access: "public" | "contacts" | "friends";
  owner_id: string | null;
};
export type AddressData = {
  id: number | string | null;
  label: string;
  access: "public" | "contacts" | "friends";
  street: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  owner_id: string | null;
};
export type RequestData = {
  id: number | string | null;
  owner: {
    name: string;
    surname: string;
    img_src: string;
  };
  owner_id: string;
  recipient_id: string;
};
export type ConnectionData = {
  id: number | string | null;
  owner: {
    name: string;
    surname: string;
    img_src: string;
  };
  owner_id: string;
  connection_id: string;
  access: "public" | "contacts" | "friends";
};
