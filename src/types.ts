export type Location = {
    id: string;
    collectionId: string;
    collectionName: string;
    created: Date;
    updated: Date;
    name: string;
    description: string;
}

export type Subtask = {
  collectionId?: string;
  collectionName?: string;
  created?: Date;
  id?: string;
  updated?: Date;
  done?: boolean;
  name: string;
};

export type Device = {
  collectionId: string;
  collectionName: string;
  created: Date;
  description: string;
  functional: boolean;
  id: string;
  location: string;
  name: string;
  updated: Date;
  expand?: {
    location?: Location;
  }
}

export type User = {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    email: string;
    emailVisibility: boolean;
    name: string;
    role: "user" | "admin";
    updated: string;
    username: string;
    verified: boolean;
}

export type Document = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  updated: Date;
  file: string;
  task: string;
  expand?: {
    task: Task;
  };
};

export type Task = {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: Date;
  upated?: Date;
  created_by?: string;
  title: string;
  status: "pending" | "progress" | "done" | "";
  due: Date | null;
  device: string;
  assignees: string[];
  subtasks: string[];
  notes: string;
  expand?: {
    device?: Device;
    assignees?: User[];
    subtasks?: Subtask[];
    created_by?: User;
  };
}