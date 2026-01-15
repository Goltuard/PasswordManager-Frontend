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

  const [error, setError] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = async () => {
    try {
      const validationErrors: string[] = [];

      if (form.userName === null || form.userName === undefined || form.userName === "") {
        validationErrors.push("User name can not be empty. \n");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        validationErrors.push("This email is not valid. \n");
      }

      if (form.password.length < 6) {
        validationErrors.push("Password must be at least 6 characters long. \n");
      }

      if (!/[A-Z]/.test(form.password)) {
        validationErrors.push("Password must contain at least one capital letter. \n");
      }

      if (!/[0-9]/.test(form.password)) {
        validationErrors.push("Password must contain at least one number. \n");
      }

      if (error.length > 0) {
        setError(validationErrors);
        setSuccessMessage(null);
        return;
      }

      setError([]);

      const response = await Account.register(form);
      const user = response.data;

      localStorage.setItem("jwt", user.token);
      setSuccessMessage("Registration succesful");
    } catch (err: any) {
      setError([
        typeof err.response?.data === "string"
          ? err.response.data
          : "Registration failed"
      ]);
      setSuccessMessage(null);
    }
  };

  return (
    <div className={global.container}>
      <div className={global.formContainer}>
        <h2 className={global.title}>Register</h2>
        <div className={global.formGroup}>
          <input
            className={global.inputText}
            placeholder="User name"
            value={form.userName}
            onChange={(e) =>
              setForm({ ...form, userName: e.target.value })
            }
          />

          <input
            className={global.inputText}
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className={global.inputText}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button onClick={submit} className={global.saveButton}>Register</button>
        </div>
      </div>

      {error.length > 0 && (
        <div className={global.errorBox}>
          {error.map((err, i) => (
            <div key={i} className={global.errorItem}>
              {err}
            </div>
          ))}
        </div>
      )}

      {successMessage && (
        <div className={global.successBox}>
          <p className={global.successItem}>{successMessage}</p>
        </div>)}
    </div>
  );
}
