import React from "react";
import NavBar from "./NavBar";
import styles from "../styles/Global.module.css";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <NavBar />
      {children}
    </div>
  );
}
