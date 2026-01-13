import axios from 'axios';
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
    if (addMode) {
      setCredentialData({
        serviceName: "",
        userName: "",
        password: "",
        note: ""
      })
      setCredentialContainer({
        id: null,
        hash: "",
        string: credentialData
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
        if (credentialContainer) {
          setCredentialData(response.data.string);
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchContainerById();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (credentialContainer) {
      const { name, value } = e.target;
      setCredentialContainer({
        ...credentialContainer,
        [name]: value,
      });
    }
  };

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

    setCredentialContainer({
      ...credentialContainer,
      hash: generatePassword(16),
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialContainer) return;

    const { id, ...payload } = credentialContainer;
    if (addMode) {
      api.post(`/credentialcontainers`, payload)
      .then(() => navigate("/home"))
      .catch(err => console.error(err));
    } else {
      api.put(`/credentialcontainers/${id}`, payload)
      .then(() => navigate("/home"))
      .catch(err => console.error(err));
    }
  };

    const handleDelete = () => {
        if (!credentialContainer?.id) return;
        if (window.confirm("Are you sure you want to delete this password?")) {
            api.delete(`/credentialcontainers/${id}`)
            .then(() => navigate("/home"))
            .catch(err => console.error(err));
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
          <label>Service Name:</label>
          <input
            type="text"
            name="serviceName"
            value={credentialContainer ? credentialData.serviceName : ""}
            onChange={handleDataChange}
          />
        </div>

        <div className={style.formGroup}>
          <label>User name:</label>
          <input
            type="text"
            name="userName"
            value={credentialContainer ? credentialData.userName : ""}
            onChange={handleDataChange}
          />
        </div>

        <div className={style.formGroup}>
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={credentialContainer ? credentialData.password : ""}
            onChange={handleDataChange}
          />
        </div>

        <div className={style.formGroup}>
          <label>Note:</label>
          <input
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
    </div>
    );
}