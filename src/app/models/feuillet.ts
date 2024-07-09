import { Eglise } from "./eglise";
import { Paroisse } from "./paroisse";
import { Utilisateur } from "./utilisateur";

export interface Feuillet {
    id: number;
    description: string;
    utilisateur?: Utilisateur;
    eglise?: Eglise;
    egliseName?: string;
    celebrationDate: string; // Utilisation de string pour simplifier la gestion des dates
    paroisse: Paroisse;
    fileUrl?: string;
    viewCount: number;
}

export interface FeuilletData {
    eglise_id: string;
    celebration_date: string;
    paroisse_id: string;
    feuillet: File;
}