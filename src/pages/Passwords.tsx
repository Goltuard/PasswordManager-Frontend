import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialContainer } from "../models/CredentialContainer";
import { deleteContainer, getContainers } from "../api/credentialContainersApi";
import styles from "../styles/Passwords.module.css";

export default function Passwords() {
  const [items, setItems] = useState<CredentialContainer[]>([]);
  const [shownId, setShownId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function load() {
    const data = await getContainers();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await deleteContainer(id);
    if (shownId === id) setShownId(null);
    load();
  }

  return (
    <div className={styles.container}>
      <h2>Passwords</h2>

      <button
        className={styles.addButton}
        onClick={() => navigate("/passwords/new")}
      >
        + Add
      </button>

      <div className={styles.list}>
        {items.map((item) => {
          const data = JSON.parse(item.containerString);

          return (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.itemLeft}>
                <strong className={styles.serviceName}>{data.serviceName}</strong>
                <span className={styles.userName}>{data.userName}</span>
              </div>

              <div className={styles.itemRight}>
                <span className={styles.password}>
                  {shownId === item.id ? data.password : "••••••••"}
                </span>

                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setShownId(shownId === item.id ? null : item.id)}
                >
                  {shownId === item.id ? "Hide" : "Show"}
                </button>

                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => navigate(`/passwords/${item.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
