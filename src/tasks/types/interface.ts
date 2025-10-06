import { TaskStatus } from "./enums";

export type IFetchAllTasksReqObj = {
  board_id: string;
  search?: string;
  filter_user_id?: string;
};

export type ICreateBoardServiceReqObj = {
  name: string;
  description: string | null;

  user_id: string; // created_by
};

export type ICreateBoardDbReqObj = {
  name: string;
  description: string | null;

  created_by: string; // user_id
  created_at: string;
};

export type ICreateTaskDbReqObj = {
  board_id: number;
  slug: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: number;
  created_by: number; // user_id
  created_at: string;
};

export type ICreateTaskServiceReqObj = {
  board_id: number;
  title: string;
  description: string | null;
  assignee_id: number;

  user_id: number; // created_by
};

export type IUpdateTaskStatusReqObj = {
  id: number;
  status: TaskStatus;
  user_id: number;
};

export type IUpdateTaskServiceReqObj = {
  id: number;
  title?: string;
    assignee_id: number;
  description?: string | null;
  status?: TaskStatus;
  user_id: number;
};

export type IDeleteTaskServiceReqObj = {
  id: number;
  user_id: number;
};

export type IFetchAllTasksResponse = {
  tasks: {
    pending: any[];
    in_progress: any[];
    completed: any[];
  };
  counts: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  total: number;
};

export type IUpdateTaskByIdDbObj = {
  id: number;
  title?: string;
  description?: string | null;
  status?: TaskStatus;

  updated_by: number;
  updated_at: string;
};

export type ITaskByIdDbObj = {
  id: number;
  board_id: number;
  slug: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_by: number; // user_id
  created_at: string;
};
