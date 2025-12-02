import style from "../styles/Global.module.css";

export default function About() {
    return(
        <div className={style.container}>
            <h2 className={style.title}>A simple password manager app.</h2>
            <p className={style.text}>Authors: Bartosz Kiwosz, Konrad Kubik, Krzysztof Szlachta.</p>
        </ div>
    )
}