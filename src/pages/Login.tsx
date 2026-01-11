import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/auth";
import global from "../styles/Global.module.css";

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
    <div className={global.container}>
      <h2 className={global.title}>Unlock vault</h2>

      <form onSubmit={handleSubmit}>
        <input
          className={global.input}
          type="password"
          placeholder="Master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={global.saveButton}>
          Unlock
        </button>

        <button
          type="button"
          className={global.deleteButton}
          onClick={handleReset}
        >
          Reset master password
        </button>

        {error && <p className={global.errorMessage}>{error}</p>}
      </form>
    </div>
  );
}
