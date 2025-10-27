export interface TaskPayload {
  title: string;
  completed?: boolean;
}

export interface TaskDocument {
  _id: string;
  user: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
