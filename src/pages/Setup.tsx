import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/auth";
import styles from "../styles/Global.module.css";

export default function Setup() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.trim().length < 4) {
      setError("Password too short");
      return;
    }

    const hash = await hashPassword(password);
    localStorage.setItem("masterPasswordHash", hash);

    navigate("/login", { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Set master password</h2>

      <input
        type="password"
        placeholder="Master password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Save</button>
    </form>
  );
}
