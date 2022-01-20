import styles from "./logo.module.css";
import { useState, useContext, useEffect } from "react";
import { MouseContext } from "../../context/mouseContext";

export const Logo = () => {
  const mousePos = useContext(MouseContext);
  const [leftEyePos, setLeftEyePos] = useState([1, 2]);
  const [rightEyePos, setRightEyePos] = useState([1, 2]);

  useEffect(() => {
    // Turn into percent
    const xPercent = mousePos[0] / window.innerWidth;
    const yPercent = mousePos[1] / window.innerHeight;

    // Set eye pos
    setLeftEyePos([12 * xPercent, 13 * yPercent]);
    setRightEyePos([12 * xPercent, 13 * yPercent]);
  }, [mousePos]);

  return (
    <div className={styles.container} /*onMouseMove={() => console.log("test")}*/>
      <div
        className={styles.eye}
        style={{ marginTop: "-5px", marginRight: "-5px", zIndex: 2 }}
      >
        <div
          style={{
            transform: `translate(${leftEyePos[0]}px, ${leftEyePos[1]}px)`,
          }}
        />
      </div>
      <div className={styles.eye}>
        <div
          style={{
            transform: `translate(${rightEyePos[0]}px, ${rightEyePos[1]}px)`,
          }}
        />
      </div>
      <h3 className={styles.title}>contact.computer</h3>
    </div>
  );
};
