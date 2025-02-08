export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    paroisse?: string;
}
export interface UtilisateurData extends Utilisateur {
    password: string
}

export interface EditUtilisateurData {
  nom: string;
  prenom: string;
  email: string;
}

export interface ConnexionData {
  username: string;
  password: string;
}

export interface ChangePasswordData {
  ancienPassword: string;
  nouveauPassword: string;
}

export interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirm_password: string;
  termsAccepted: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirm_password: string;
}