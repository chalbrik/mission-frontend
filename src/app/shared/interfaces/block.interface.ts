export interface BlockFormInterface {
  goal: number;
  name: string;
}

export interface BlockInterface {
  id: number;
  name: string;
  difficulty: number;
  scheduled_date?: string;
  created_at: string;
  goal: number;
}
