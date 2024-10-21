import { Paroisse } from "./paroisse";

export interface Diocese {
  id: number;
  nom: string;
  paroisses: Paroisse[]
}