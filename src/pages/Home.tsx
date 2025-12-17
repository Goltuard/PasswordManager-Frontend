import React from 'react';
import style from '../styles/Global.module.css'

export default function Home() {
  return (
  <div className={style.container}>
    <h1 className={style.title}>Welcom to our password manager!</h1>
    <p className={style.text}>To navigate use the navigation bar.</p>
  </div>);
}