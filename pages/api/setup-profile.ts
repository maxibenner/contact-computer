// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../sdk/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    name: string;
  }>
) {
  // Get user cookie
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) return;

  const { name, surname } = req.body;

  // Insert row into db
  const { data, error } = await supabase
    .from("profile")
    .insert([{ id: user?.id, name: name, surname: surname }], {
      returning: "minimal",
    });

  // Send response
  res.status(200).json({ name: "John" });
}
