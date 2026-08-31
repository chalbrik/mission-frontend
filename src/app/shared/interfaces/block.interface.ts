export interface BlockFormInterface {
  goal: number;
  name: string;
  start_date: string | null;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
}

export interface BlockInterface {
  id: number;
  name: string;
  difficulty: number;
  completed: boolean;
  start_date: string | null;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  created_at: string;
  goal: number;
}
