import { useState } from "react";
import { Account } from "../api/Account";
import { RegisterContainer } from "../models/Register";
import global from "../styles/Global.module.css"

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterContainer>({
    userName: "",
    email: "",
    password: "",
    publicKey: "temporaryKey"
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      const response = await Account.register(form);
      const user = response.data;

      localStorage.setItem("jwt", user.token);
      setSuccessMessage("Logged in succesfully!");
    } catch (err: any) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Registration failed"
      );
    }
  };

  return (
    <div className={global.container}>
      <div className={global.formContainer}>
        <h2 className={global.title}>Register</h2>
        <div className={global.formGroup}>
      <input
        placeholder="User name"
        value={form.userName}
        onChange={(e) =>
          setForm({ ...form, userName: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button onClick={submit} className={global.loginButton}>Register</button>
    </div>
    </div>
      {error && <p className={global.errorBox}>{error}</p>}
      {successMessage && <p className={global.successBox}>{successMessage}</p>}
    </div>
  );
}
