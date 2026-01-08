import { Link, useNavigate } from "react-router-dom";
import style from "../styles/NavBar.module.css";

export default function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("unlocked");
    navigate("/login", { replace: true });
  }

  return (
    <nav className={style.navbar}>
      <Link to="/passwords" className={style.navButton}>Passwords</Link>
      <button onClick={handleLogout} className={style.navButton}>
        Logout
      </button>
    </nav>
  );
}
