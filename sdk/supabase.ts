import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDYwMjM5OCwiZXhwIjoxOTU2MTc4Mzk4fQ.tEs7ub86jq5WSWlcNneX-lXLbgiUd_DGWalT8veUhaM";
const SUPABASE_URL = "https://oedndnouvlbxuwkvdynh.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
