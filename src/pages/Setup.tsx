import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../utils/auth";
import global from "../styles/Global.module.css";
import { api } from "../api/apiClient";

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

    const email = window.prompt("Email");
    if (!email || !email.trim()) {
      setError("Email required");
      return;
    }

    const userName = email.split("@")[0] || email;

    try {
      await api.post("/Users/register", {
        userName,
        email,
        password,
        publicKey: "TEMP_PUBLIC_KEY"
      });
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data ?? err));
      return;
    }

    const hash = await hashPassword(password);
    localStorage.setItem("masterPasswordHash", hash);
    localStorage.setItem("userEmail", email);

    navigate("/login", { replace: true });
  }

  return (
    <div className={global.container}>
      <form onSubmit={handleSubmit} className={global.form}>
        <h2 className={global.title}>Set master password</h2>

        <input
          className={global.input}
          type="password"
          placeholder="Master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={global.saveButton}>
          Save
        </button>

        {error && <p className={global.errorMessage}>{error}</p>}
      </form>
    </div>
  );
}
