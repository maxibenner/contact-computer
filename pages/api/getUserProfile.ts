// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../sdk/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  // Return if user is not authenticated
  if (!user) return res.status(400).json({ error: "User not authenticated" });

  // Build image src
  // const image_src =

  const { data, error } = await supabase
    .from("profile")
    .select("id, name, surname, img_src")
    .eq("id", user.id);

  // Return if user has not input any data
  if (error) return res.status(400).json({ error: "No user data found" });

  // Return if user exists and has data
  res.status(200).json(data);
}
