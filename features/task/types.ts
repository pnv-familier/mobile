export enum TaskStatus {
  PENDING = "PENDING",
  SHARED = "SHARED",
  COMPLETED = "COMPLETED"
}

export interface LoveTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
  };
  toUser: {
    id: string;
    name: string;
    avatar: string;
  };
  assignedToCurrentUser: boolean;
}
