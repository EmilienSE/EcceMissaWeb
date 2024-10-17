export interface Utilisateur {
    id: number;
    // Ajoutez d'autres propriétés pertinentes de l'utilisateur ici
}

export interface ConnexionData {
  username: string;
  password: string;
}

export interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirm_password: string;
}