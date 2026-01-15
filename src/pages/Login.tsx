import { useState } from "react";
import { Account } from "../api/Account";
import { LoginContainer} from "../models/Login";
import global from "../styles/Global.module.css"

export default function LoginForm() {
  const [form, setForm] = useState<LoginContainer>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      const response = await Account.login(form);
      const user = response.data;

      sessionStorage.setItem("jwt", user.token);
      setSuccessMessage("Logged in succesfully!");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className={global.container}>
      <div className={global.formContainer}>
        <h2 className={global.title}>Login</h2>
        <div className={global.formGroup}>
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
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button onClick={submit} className={global.saveButton}>Login</button>
        </div>
      </div>
      {error && <p className={global.errorBox}>{error}</p>}
      {successMessage && <p className={global.successBox}>{successMessage}</p>}
    </div>
  );
}