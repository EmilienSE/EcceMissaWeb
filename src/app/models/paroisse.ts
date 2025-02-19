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
    diocese_id?: string;
    responsables: number;
    feuillets: Feuillet[];
    paiement_a_jour: boolean;
    code_unique: string;
    qr_code?: string;
}

export interface ParoisseData {
    nom: string;
    gps: string;
    diocese_id: string;
    acceptCgvCgu?: boolean;
}

export interface RetryPaymentData {
    acceptCgvCgu?: boolean;
}

export interface JoinParoisseData {
    codeUnique: string;
}