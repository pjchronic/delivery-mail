export interface PackageDeliveryInterface {
  template: string;
  destinatario: string;
  assunto: string;
}

export interface ErrorInterface {
  destinyError: boolean | undefined;
  helperDestiny: string;
  subjectError: boolean | undefined;
  helperSubject: string;
}

export interface SnackBarInterFace {
  openSnackBar: boolean;
  severity?: "error" | "info" | "success" | "warning";
  msg: string;
}
