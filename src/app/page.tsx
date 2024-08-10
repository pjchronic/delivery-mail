"use client";

import { useState } from "react";
import CodeMirrorExtern from "./components/CodemirrorExtern";
import styles from "./page.module.css";

interface packageDeliveryInterface {
  template: string;
  destinatario: string;
}

export default function Home() {
  const [packageDelivery, setPackageDelivery] =
    useState<packageDeliveryInterface>({ template: "", destinatario: "" });

  console.log(packageDelivery);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;

//     setPackageDelivery((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

  const handleChangeCodeMirror = (value: string) => {
    setPackageDelivery((prev) => ({
      ...prev,
      template: value,
    }));
  };

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div>
          <h1 className="title">Insira o seu template de e-mail aqui:</h1>
          <CodeMirrorExtern
            name="template"
            onChange={handleChangeCodeMirror}
            value={packageDelivery?.template}
          />
        </div>
      </section>
    </main>
  );
}
