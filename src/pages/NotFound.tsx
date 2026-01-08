import { Link } from "react-router-dom";
import styles from "../styles/Global.module.css"

export default function NotFound(){
    return(
        <button className={styles.container}>
            <Link to="/" className={styles.button}>Return to main page</Link>
        </button>
    )
}
