import { Diocese } from "./diocese";
import { Eglise } from "./eglise";
import { Feuillet } from "./feuillet";
import { Utilisateur } from "./utilisateur";

export interface Paroisse {
    id: number;
    nom: string;
    gps: string;
    eglises: Eglise[];
    diocese?: Diocese;
    responsables: Utilisateur[];
    feuillets: Feuillet[];
}

export interface ParoisseData {
    nom: string;
    gps: string;
    diocese_id: string;
}