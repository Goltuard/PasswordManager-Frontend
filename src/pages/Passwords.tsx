import axios from 'axios';
import { useEffect, useState } from "react";
import { CredentialContainer } from "../models/CredentialContainer";
import { Link } from 'react-router-dom';
import style from '../styles/Global.module.css';
import api from "../api/ApiConfig"


export default function Passwords() {
    const [CredentialContainers, setCredentialContainers] = useState<CredentialContainer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.get("/credentialcontainers").then((response) => {
            setCredentialContainers(response.data);
        })
        .catch((err) => {
        let message = "Error fetching cars";
          if(err.response) 
            if (err.response.status === 401)
              message = "Please log in before accesing cars";
          setError(message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

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
        <h1 className={style.title}>Passwords</h1>
        <ul className={style.list}>
            {CredentialContainers.map(container => (
                <li key={container.id} className={style.listItem}>
                    <p>Srvice Name: {container.string.serviceName}</p>
                    <p>User name: {container.string.userName}</p>
                    <Link to={`/edit/${container.id}`} className={style.button}>Edit</Link>
                </li>
            ))}
        </ul>
    </div>
  );
}
