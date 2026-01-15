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
  const [error, setError] = useState<string | null>(null);
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
        setError("Missing ID");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/credentialcontainers/${id}`);
        setCredentialContainer(response.data ?? null);
        setCredentialData(JSON.parse(response.data.containerString));
      } catch (err) {
        setError('Error fetching data');
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
    e.preventDefault();
    if (!credentialContainer) return;

    const payload = { 
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      containerHash: "temporaryHash",
      containerString: JSON.stringify(credentialData)
    }
    if (addMode) {
      api.post(`/credentialcontainers`, payload)
      .then(() => navigate("/passwords"))
      .catch(err => console.error(err));
    } else {
      api.put(`/credentialcontainers/${id}`, payload)
      .then(() => navigate("/passwords"))
      .catch(err => {
        const message =
          err.response?.data?.message ||
          err.response?.data ||
          "Saving failed";

        setError(message);
      });
    }
  };

  const handleDelete = () => {
    if (!credentialContainer?.id) return;
    if (window.confirm("Are you sure you want to delete this credential?")) {
      api.delete(`/credentialcontainers/${id}`)
        .then(() => navigate("/passwords"))
        .catch(err => {
          const message =
            err.response?.data?.message ||
            err.response?.data ||
            "Saving failed";

        setError(message);
        }
      );
    }
  };

  if (loading) return (
  <div className={style.container}>
    <p className={style.title}>Loading...</p>
  </div>
  );
  if (error) return (
  <div className={style.container}>
    <p className={style.title}>{error}</p>
  </div>
  );

  return (
  <div className={style.container}>
    <form onSubmit={handleSubmit} className={style.formContainer}>
      
      <div className={style.formGroup}>
        <label className={style.title}>Service Name:</label>
        <input
          className={style.inputText}
          type="text"
          name="serviceName"
          value={credentialContainer ? credentialData.serviceName : ""}
          onChange={handleDataChange}
        />
      </div>

      <div className={style.formGroup}>
        <label className={style.title}>User name:</label>
        <input
          className={style.inputText}
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
          type="text"
          name="note"
          value={credentialContainer ? credentialData.note : ""}
          onChange={handleDataChange}
        />
      </div>

      <button type="submit" className={style.saveButton}>Save</button>
      <button type="button" className={style.saveButton} onClick={handleGeneratePassword}>Generate</button>
      <button type="button" disabled={addMode} className={style.deleteButton} onClick={handleDelete}>Delete</button>
    </form>
    {error && (
      <div className={style.errorBox}>
        <p className={style.errorItem}>{error}</p>
      </div>
    )}
  </div>
  );
}