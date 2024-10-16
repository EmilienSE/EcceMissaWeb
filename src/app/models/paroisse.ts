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
    responsables: string[];
    feuillets: Feuillet[];
    paiement_a_jour: boolean;
    code_unique: string;
}

export interface ParoisseData {
    nom: string;
    gps: string;
    diocese_id: string;
}

export interface JoinParoisseData {
    codeUnique: string;
}