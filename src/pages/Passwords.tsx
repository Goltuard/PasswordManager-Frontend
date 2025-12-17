import axios from 'axios';
import { useEffect, useState } from "react";
import { CredentialContainer } from "../models/CredentialContainer";
import { baseUrl } from '../models/BaseUrl';
import { Link } from 'react-router-dom';
import style from '../styles/Global.module.css';


export default function Passwords() {
    const [CredentialContainers, setCredentialContainers] = useState<CredentialContainer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
axios.get<CredentialContainer[]>(baseUrl + "/CredentialContainers")

        .then((response) => {
            setCredentialContainers(response.data);
        })
        .catch((err) => {
  console.log(err);
  setError('Error fetching data');
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
                    <p>Name: {container.name}</p>
                    <p>Password: {container.hash}</p>
                    <Link to={`/edit/${container.id}`} className={style.button}>Edit</Link>
                </li>
            ))}
        </ul>
    </div>
  );
}