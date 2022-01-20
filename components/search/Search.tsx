import { Button } from "../button/Button";
import styles from "./search.module.css";
import { MdSearch } from "react-icons/md";
import React, { useState } from "react";

export const Search = ({
  onChange,
  onSearch,
  style,
}: {
  onChange?: Function;
  onSearch?: Function;
  style?: React.CSSProperties;
}) => {
  const [value, setValue] = useState<string>();
  const handleChange = (t: string) => {
    setValue(t);
    onChange && onChange(t);

    // Search after every input change (only after more than 5 characters)
    if (value && value.length > 5) {
      console.log("Searching after every input change");
      handleSearch();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch && onSearch(value);
  };
  const handleSearch = () => {
    onSearch && onSearch(value);
  };

  return (
    <form className={styles.container} style={style} onSubmit={handleSubmit}>
      <input
        placeholder="Type a name"
        style={{ display: "inline-block" }}
        onChange={(e) => handleChange(e.target.value)}
      />
      <Button
        onClick={handleSearch}
        icon={<MdSearch />}
        style={{
          position: "absolute",
          right: "10px",
        }}
      />
    </form>
  );
};
