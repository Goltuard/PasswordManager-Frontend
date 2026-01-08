import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CredentialPayload } from "../models/CredentialPayload";
import { buildContainerString } from "../utils/container";
import { sha256Hex } from "../utils/hash";
import {
  createContainer,
  getContainer,
  updateContainer,
} from "../api/credentialContainersApi";
import styles from "../styles/Edit.module.css";

const emptyForm: CredentialPayload = {
  serviceName: "",
  userName: "",
  password: "",
  note: "",
};

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<CredentialPayload>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;

    (async () => {
      const container = await getContainer(id);
      const parsed = JSON.parse(container.containerString);

      setForm({
        serviceName: parsed.serviceName ?? "",
        userName: parsed.userName ?? "",
        password: parsed.password ?? "",
        note: parsed.note ?? "",
      });

      setLoading(false);
    })();
  }, [id, isEdit]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const containerString = buildContainerString(form);
    const containerHash = await sha256Hex(containerString);

    const payload = {
      userId: "00000000-0000-0000-0000-000000000001",
      containerString,
      containerHash,
    };

    if (isEdit && id) {
      await updateContainer(id, payload);
    } else {
      await createContainer(payload);
    }

    navigate("/passwords", { replace: true });
  }

  if (loading) return <p className={styles.container}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>{isEdit ? "Edit password" : "Add password"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="serviceName"
          placeholder="Service"
          value={form.serviceName}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          name="userName"
          placeholder="Username"
          value={form.userName}
          onChange={handleChange}
          required
        />

        {/* Password + Show/Hide */}
        <div className={styles.passwordRow}>
          <input
            className={styles.input}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className={styles.button}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <textarea
          className={styles.textarea}
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
        />

        <button
          disabled={saving}
          type="submit"
          className={`${styles.button} ${styles.saveButton}`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
