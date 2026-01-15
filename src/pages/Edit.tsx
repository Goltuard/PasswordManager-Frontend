import api from "../api/ApiConfig"
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CredentialContainer, CredentialData } from "../models/CredentialContainer";
import style from "../styles/Global.module.css";
import { generatePassword } from "../utils/passwordGenerator";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [credentialContainer, setCredentialContainer] = useState<CredentialContainer | null>(null);
  const [credentialData, setCredentialData] = useState<CredentialData>({
    serviceName: "",
    userName: "",
    password: "",
    note: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string[]>([]);
  let addMode = !id;

  useEffect(() => {
    setLoading(true);
    if (addMode) {
      setCredentialData({
        serviceName: "",
        userName: "",
        password: "",
        note: ""
      })
      setCredentialContainer({
        id: null,
        containerHash: "NotImplemented",
        containerString: ""
      });
    setLoading(false);
    return;
    }

    const fetchContainerById = async () => {
      if (!id) {
        setError(["Missing ID"]);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/credentialcontainers/${id}`);
        setCredentialContainer(response.data ?? null);
        setCredentialData(JSON.parse(response.data.containerString));
      } catch (err) {
        setError(['Error fetching data']);
      } finally {
        setLoading(false);
      }
    };
    fetchContainerById();
  }, [id]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (credentialContainer) {
      const { name, value } = e.target;
      setCredentialData({
        ...credentialData,
        [name]: value,
      });
    }
  };

  const handleGeneratePassword = () => {
    if (!credentialContainer) return;

    setCredentialData({
      ...credentialData,
      password: generatePassword(16),
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    setSubmitting(true);
    e.preventDefault();

    const validationErrors: string[] = [];

    if (credentialData.serviceName === "" || credentialData.serviceName === null || credentialData.serviceName === undefined)
      validationErrors.push("Service name can not be empty.");
    if (credentialData.userName === "" || credentialData.userName === null || credentialData.userName === undefined)
      validationErrors.push("Login can not be empty.");
    if (credentialData.password === "" || credentialData.password === null || credentialData.password === undefined)
      validationErrors.push("Password can not be empty.");

    if (validationErrors.length > 0) {
      setError(validationErrors);
      setSubmitting(false);
      return;
    }

    const payload = { 
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      containerHash: "temporaryHash",
      containerString: JSON.stringify(credentialData)
    }
    if (addMode) {
      api.post(`/credentialcontainers`, payload)
      .then(() => navigate("/passwords"))
      .catch(err => {
        const message =
        err.response?.data?.message ??
        err.response?.data ??
        "Adding failed";

        setError([message]);
      });
    } else {
      api.put(`/credentialcontainers/${id}`, payload)
      .then(() => navigate("/passwords"))
      .catch(err => {
        const message =
          err.response?.data?.message ??
          err.response?.data ??
          "Saving failed";

        setError([message]);
      });
    }
    setSubmitting(false);
  };

  const handleDelete = () => {
    if (!credentialContainer?.id) return;
    if (window.confirm("Are you sure you want to delete this credential?")) {
      api.delete(`/credentialcontainers/${id}`)
        .then(() => navigate("/passwords"))
        .catch(err => {
          const message =
            err.response?.data?.message ??
            err.response?.data ??
            "Deletion failed";

        setError([message]);
        }
      );
    }
  };

  if (loading) return (
  <div className={style.container}>
    <p className={style.title}>Loading...</p>
  </div>
  );

  return (
  <div className={style.container}>
    <form onSubmit={handleSubmit} className={style.formContainer}>
      
      <div className={style.formGroup}>
        <label className={style.title}>Service Name:</label>
        <input
          className={style.inputText}
          disabled={submitting}
          type="text"
          name="serviceName"
          value={credentialContainer ? credentialData.serviceName : ""}
          onChange={handleDataChange}
        />
      </div>

      <div className={style.formGroup}>
        <label className={style.title}>Login:</label>
        <input
          className={style.inputText}
          disabled={submitting}
          type="text"
          name="userName"
          value={credentialContainer ? credentialData.userName : ""}
          onChange={handleDataChange}
        />
      </div>

      <div className={style.formGroup}>
        <label className={style.title}>Password:</label>
        <input
          className={style.inputText}
          disabled={submitting}
          type="text"
          name="password"
          value={credentialContainer ? credentialData.password : ""}
          onChange={handleDataChange}
        />
      </div>

      <div className={style.formGroup}>
        <label className={style.title}>Note:</label>
        <input
          className={style.inputText}
          disabled={submitting}
          type="text"
          name="note"
          value={credentialContainer ? credentialData.note : ""}
          onChange={handleDataChange}
        />
      </div>

      <button type="submit" className={style.saveButton} disabled={submitting}>Save</button>
      <button type="button" className={style.saveButton} disabled={submitting} onClick={handleGeneratePassword}>Generate</button>
      <button type="button" disabled={submitting || addMode} className={style.deleteButton} onClick={handleDelete}>Delete</button>
    </form>
    {error.length > 0 && (
      <div className={style.errorBox}>
        {error.map((err, i) => (
          <div key={i} className={style.errorItem}>
            {err}
          </div>
        ))}
      </div>
    )}
  </div>
  );
}