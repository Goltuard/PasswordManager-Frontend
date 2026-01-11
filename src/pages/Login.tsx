import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/auth";
import styles from "../styles/Global.module.css";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("unlocked") === "true") {
      navigate("/passwords", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const savedHash = localStorage.getItem("masterPasswordHash");
    const enteredHash = await hashPassword(password);

    if (!savedHash || savedHash !== enteredHash) {
      setError("Wrong password");
      return;
    }

    sessionStorage.setItem("unlocked", "true");
    navigate("/passwords", { replace: true });
  }

  function handleReset() {
    localStorage.removeItem("masterPasswordHash");
    sessionStorage.removeItem("unlocked");
    setPassword("");
    setError("");
    navigate("/setup", { replace: true });
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Unlock vault</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className={styles.saveButton}>
          Unlock
        </button>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleReset}
        >
          Reset master password
        </button>
      </form>
    </div>
  );
}
