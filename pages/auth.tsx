import { NextPage } from "next";
import { Card } from "../components/card/Card";
import { Button } from "../components/button/Button";
import { MdArrowBack } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Input } from "../components/input/Input";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDYwMjM5OCwiZXhwIjoxOTU2MTc4Mzk4fQ.tEs7ub86jq5WSWlcNneX-lXLbgiUd_DGWalT8veUhaM";
const SUPABASE_URL = "https://oedndnouvlbxuwkvdynh.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Auth: NextPage = () => {
  const handleCreateContact = () => {
    supabase.auth.signUp({ email: "maxibenner@gmail.com", password: "123456" });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        // alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ marginTop: "150px", height: "max-content" }}>
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
          }}
        >
          <Link href="/">
            <Button
              icon={<MdArrowBack />}
              style={{ position: "absolute", top: -45, left: -45 }}
            />
          </Link>
          <h1>Sign Up</h1>
          <Input style={{ marginBottom: "15px" }} />
          <Input />
        </div>
      </Card>
    </div>
  );
};

export default Auth;
