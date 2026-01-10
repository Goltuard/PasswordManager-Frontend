import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialContainer } from "../models/CredentialContainer";
import { api } from "../api/apiClient";
import styles from "../styles/Passwords.module.css";

type ParsedContainer = {
  serviceName?: string;
  userName?: string;
  password?: string;
  note?: string;
};

function tryParseContainerString(containerString: string): ParsedContainer | null {
  try {
    const parsed = JSON.parse(containerString);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
}

export default function Passwords() {
  const [items, setItems] = useState<CredentialContainer[]>([]);
  const [shownId, setShownId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function load() {
    const res = await api.get("/sync/containers");
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await api.delete(`/CredentialContainers/${id}`);
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
          const parsed = tryParseContainerString(item.containerString);

          const serviceName = parsed?.serviceName ?? "Encrypted entry";
          const userName = parsed?.userName ?? item.containerHash;
          const passwordValue = parsed?.password ?? item.containerString;

          return (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.itemLeft}>
                <strong className={styles.serviceName}>{serviceName}</strong>
                <span className={styles.userName}>{userName}</span>
              </div>

              <div className={styles.itemRight}>
                <span className={styles.password}>
                  {shownId === item.id ? passwordValue : "••••••••"}
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
