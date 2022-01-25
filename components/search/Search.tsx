import { Button } from "../button/Button";
import styles from "./search.module.css";
import { MdSearch } from "react-icons/md";
import React, { useState } from "react";

export const Search = ({
  onSearch,
  style,
}: {
  onSearch?: Function;
  style?: React.CSSProperties;
}) => {
  const [value, setValue] = useState<string>();
  const handleChange = (t: string) => {
    setValue(t);
    onSearch && onSearch(t);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch && onSearch(value);
    console.log(value);
  };

  return (
    <form className={styles.container} style={style} onSubmit={handleSubmit}>
      <input
        placeholder="Type a name"
        style={{ display: "inline-block" }}
        onChange={(e) => handleChange(e.target.value)}
      />
      <Button
        icon={<MdSearch />}
        style={{
          position: "absolute",
          right: "10px",
        }}
      />
    </form>
  );
};
