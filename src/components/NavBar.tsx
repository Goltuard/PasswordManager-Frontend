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
      <Link to="/home" className={style.navButton}>Home</Link>
      <Link to="/passwords" className={style.navButton}>Passwords</Link>
      <Link to="/about" className={style.navButton}>About</Link>

      <button onClick={handleLogout} className={style.navButton}>
        Logout
      </button>
    </nav>
  );
}
