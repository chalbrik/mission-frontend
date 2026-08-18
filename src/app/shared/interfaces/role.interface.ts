export interface RoleFormInterface {
  name: string;
  note: string;
}

export interface RoleInterface {
  id: number;
  name: string;
  note: string;
  points: number;
  color: string;
}

export interface RoleCreatePayload extends RoleFormInterface {
  color: string
}
