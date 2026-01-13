import { Link } from "react-router-dom";
import style from "../styles/NavBar.module.css";

export default function NavBar() {
  const logout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };
  return (
    <nav className={style.navbar}>
      <Link to="/passwords" className={style.navButton}>Passwords</Link>
      <Link to='/login' className={style.navButton}>Login</Link>
      <Link to='/register' className={style.navButton}>Register</Link>
      <button onClick={logout} className={style.button}>Logout</button>
    </nav>
  );
}