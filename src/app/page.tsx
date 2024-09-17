"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { html } from "@codemirror/lang-html";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Alert, Snackbar, SnackbarCloseReason, TextField } from "@mui/material";
import {
  ErrorInterface,
  PackageDeliveryInterface,
  SnackBarInterFace,
} from "./interfaces/interfaces";

const initialHtmlTemplate = `<!-- Header Table -->
<table width="600" align="center" border="1" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <h1>Título</h1>
        </td>
    </tr>
</table>

<!-- Content Table -->
<table width="600" align="center" border="1" cellpadding="0" cellspacing="0">
    <tr>
        <td>
            <p>Conteúdo do e-mail</p>
        </td>
    </tr>
</table>
<!-- Footer Table -->
<table width="600" align="center" border="1" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <p>Rodapé</p>
        </td>
    </tr>
</table>`;

export default function Home() {
  const [snackBar, setSnackBar] = useState<SnackBarInterFace>({
    openSnackBar: false,
    severity: "info",
    msg: "",
  });

  const [packageDelivery, setPackageDelivery] =
    useState<PackageDeliveryInterface>({
      template: initialHtmlTemplate,
      destinatario: "",
      assunto: "",
    });
  const [error, setError] = useState<ErrorInterface>({
    destinyError: undefined,
    helperDestiny: "",
    subjectError: undefined,
    helperSubject: "",
  });

  const handleSnackBar = (sucess: boolean, msg: string) => {
    if (sucess) {
      setSnackBar((prev) => ({
        ...prev,
        openSnackBar: true,
        severity: "success",
        msg,
      }));
    } else {
      setSnackBar((prev) => ({
        ...prev,
        openSnackBar: true,
        severity: "error",
        msg,
      }));
    }
  };

  const handleCloseSnackBar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBar((prev) => ({
      ...prev,
      openSnackBar: false,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPackageDelivery((prev) => ({
      ...prev,
      [name]: value,
    }));

    const emailRegex =
      /^([\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,})(;[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,})*$/;

    const testEmails = (emails: string) => emailRegex.test(emails);

    switch (name) {
      case "destinatario":
        if (value === "") {
          setError((prev) => ({
            ...prev,
            destinyError: true,
            helperDestiny:
              "É necessário que este campo seja preenchido com o endereço de email do destinatario",
          }));
        } else if (!testEmails(value)) {
          setError((prev) => ({
            ...prev,
            destinyError: true,
            helperDestiny:
              "O campo de destinatario foi preenchido incorretamente. Você pode inserir mais de um email separando-os por ponto e vírgula",
          }));
        } else {
          setError((prev) => ({
            ...prev,
            destinyError: false,
            helperDestiny: "",
          }));
        }
        break;

      case "assunto":
        if (value === "") {
          setError((prev) => ({
            ...prev,
            subjectError: true,
            helperSubject: "Uma informação de assunto é necessária",
          }));
        } else {
          setError((prev) => ({
            ...prev,
            subjectError: false,
            helperSubject: "",
          }));
        }
        break;
    }
  };

  const handleChangeCodeMirror = (value: string) => {
    setPackageDelivery((prev) => ({
      ...prev,
      template: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error.destinyError === false && error.subjectError === false) {
      try {
        const response = await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(packageDelivery),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro desconhecido");
        }

        handleSnackBar(true, "Email enviado com sucesso");
      } catch (error: any) {
        handleSnackBar(false, error.message);
      }
    } else {
      handleSnackBar(false, "Um ou mais campos estão incorretos");
    }
  };

  const handleReset = () => {
    setPackageDelivery({
      template: "",
      destinatario: "",
      assunto: "",
    });
    setError((prev) => ({
      ...prev,
      subjectError: true,
      destinyError: true,
    }));
  };

  return (
    <>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.section}>
          <div className={styles.section__module}>
            <h1 className="title">Insira o seu template de e-mail aqui:</h1>
            <ReactCodeMirror
              onChange={handleChangeCodeMirror}
              value={packageDelivery?.template}
              height="300px"
              width="100%"
              theme="dark"
              extensions={[html()]}
            />
          </div>
          <div className={styles.section__module}>
            <TextField
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              name="destinatario"
              onChange={handleChange}
              value={packageDelivery?.destinatario}
              label="Destinatarios"
              size="small"
              multiline
              minRows={3}
              error={error.destinyError}
              helperText={error.helperDestiny}
            />
            <TextField
              sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
              name="assunto"
              onChange={handleChange}
              value={packageDelivery?.assunto}
              label="Assunto"
              size="small"
              error={error.subjectError}
              helperText={error.helperSubject}
            />
          </div>
          <div className={styles.section__btn}>
            <button
              type="reset"
              onClick={handleReset}
              className={styles.btnReset}
            >
              Limpar
            </button>
            <button type="submit" className={styles.btnSubmit}>
              Enviar
            </button>
          </div>
        </form>
      </main>
      <Snackbar
        open={snackBar.openSnackBar}
        autoHideDuration={4000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBar.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
