import { Feuillet } from "./feuillet";
import { Paroisse } from "./paroisse";
import { Utilisateur } from "./utilisateur";


export interface Eglise {
  id: number;
  nom: string;
  gps: string;
  paroisse?: Paroisse;
  feuillets: Feuillet[];
  responsables: Utilisateur[];
}

export interface EgliseData {
    nom: string;
    gps: string;
    paroisse_id: string;
}