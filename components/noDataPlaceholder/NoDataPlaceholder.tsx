import styles from "./noDataPlaceholder.module.css";

export const NoDataPlaceholder = ({ text }: { text: string }) => {
  return (
    <div className={styles.noDataContainer}>
      <p>{text}</p>
    </div>
  );
};
