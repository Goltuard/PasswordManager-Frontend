import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CredentialPayload } from "../models/CredentialPayload";
import { buildContainerString } from "../utils/container";
import { sha256Hex } from "../utils/hash";
import { api } from "../api/apiClient";
import global from "../styles/Global.module.css";
import local from "../styles/Edit.module.css";

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
      const res = await api.get(`/CredentialContainers/${id}`);
      const container = res.data;

      setForm({
        serviceName: "",
        userName: "",
        password: "",
        note: "",
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
      containerString,
      containerHash,
    };

    if (isEdit && id) {
      await api.put(`/CredentialContainers/${id}`, payload);
    } else {
      await api.post(`/CredentialContainers`, payload);
    }

    navigate("/passwords", { replace: true });
    setSaving(false);
  }

  if (loading) return <p className={global.container}>Loading...</p>;

  return (
    <div className={global.container}>
      <h2>{isEdit ? "Edit password" : "Add password"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          className={global.input}
          name="serviceName"
          placeholder="Service"
          value={form.serviceName}
          onChange={handleChange}
          required
        />

        <input
          className={global.input}
          name="userName"
          placeholder="Username"
          value={form.userName}
          onChange={handleChange}
          required
        />

        <div className={local.passwordRow}>
          <input
            className={global.input}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className={global.button}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <textarea
          className={local.textarea}
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
        />

        <button
          disabled={saving}
          type="submit"
          className={`${global.button} ${local.saveButton}`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
