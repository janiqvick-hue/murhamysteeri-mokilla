export type LocationId =
  | 'laituri'
  | 'kaivo'
  | 'metsapolku'
  | 'vaja'
  | 'vierashuone'
  | 'rantasauna'
  | 'laiturin_alla'
  | 'kellari';

export type EvidenceId =
  | 'puhelin'
  | 'muistilappu'
  | 'lankku'
  | 'paivakirja_sivu'
  | 'avain'
  | 'kartta'
  | 'valokuva'
  | 'kirje'
  | 'merkki'
  | 'metallirasia';

export interface Evidence {
  id: EvidenceId;
  name: string;
  foundAt: string;
  description: string;
  icon: string; // Emoji-symboli tai Lucide-ikonin avain
  imageUrl?: string;
  secretHint?: string;
}

export interface LocationData {
  id: LocationId;
  name: string;
  description: string;
  backgroundImageUrl?: string; // Varaväriliuku tarvittaessa
  ambientSoundName?: string;
  interactiveObjects: InteractiveObject[];
}

export interface InteractiveObject {
  id: string;
  name: string;
  description: string;
  icon: string;
  onInteract: string; // Kuvaus tapahtumasta
  evidenceToReveal?: EvidenceId;
  requiredEvidence?: EvidenceId;
  solved?: boolean;
}

export interface GameState {
  currentLocation: LocationId;
  unlockedLocations: LocationId[];
  collectedEvidence: EvidenceId[];
  suitcaseCodeEntered: string;
  suitcaseUnlocked: boolean;
  chestUnlocked: boolean;
  cabinetUnlocked: boolean;
  gameCompleted: boolean;
  journalReadCount: number;
  gameStarted: boolean;
}
