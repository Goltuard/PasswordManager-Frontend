import axios from 'axios';
import { baseUrl } from '../models/BaseUrl';
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CredentialContainer } from "../models/CredentialContainer";
import style from "../styles/Global.module.css";

export default function Edit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string}>();
    const [credentialContainer, setCredentialContainer] = useState<CredentialContainer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let addMode = !id;

    useEffect(() => {
        if (addMode) {
            setCredentialContainer({
                id: null,
                name: "",
                hash: "",
                key: ""
            });
        setLoading(false);
        return;
        }

        const fetchContainerById = async () => {
            try {
                const response = await axios.get(`${baseUrl}/users/${id}`);
                setCredentialContainer(response.data);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!credentialContainer) return;

        const { id, ...payload } = credentialContainer;

        if (addMode) {
            axios.post(`${baseUrl}/users/${credentialContainer.id}`, payload)
            .then(() => navigate("/home"))
            .catch(err => console.error(err));
        } else {
            axios.post(`${baseUrl}/users`, payload)
            .then(() => navigate("/home"))
            .catch(err => console.error(err));
        }
    };

    const handleDelete = () => {
        if (!credentialContainer?.id) return;
        if (window.confirm("Are you sure you want to delete this password?")) {
            axios.delete(`${baseUrl}/users/${credentialContainer.id}`)
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
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={credentialContainer ? credentialContainer.name : ""}
            onChange={handleChange}
          />
        </div>

        <div className={style.formGroup}>
          <label>Password:</label>
          <input
            type="text"
            name="hash"
            value={credentialContainer ? credentialContainer.hash : ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={style.saveButton}>Save</button>
        <button type="button" disabled={addMode} className={style.deleteButton} onClick={handleDelete}>Delete</button>
      </form>
    </div>
    );
}