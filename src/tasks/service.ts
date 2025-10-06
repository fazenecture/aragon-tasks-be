import { randomUUID } from "node:crypto";
import TasksHelper from "./helper";
import {
  ICreateTaskDbReqObj,
  ICreateTaskServiceReqObj,
  IUpdateTaskStatusReqObj,
  IUpdateTaskServiceReqObj,
  IDeleteTaskServiceReqObj,
  IFetchAllTasksReqObj,
  IFetchAllTasksResponse,
} from "./types/interface";
import moment from "moment";
import ErrorHandler from "../utils/error.handler";
import { TaskStatus } from "./types/enums";
import BoardsService from "../boards/service";

export default class TasksService extends TasksHelper {
  boardService: BoardsService;

  constructor() {
    super();
    this.boardService = new BoardsService();
  }

  protected fetchAllTasksService = async (obj: IFetchAllTasksReqObj): Promise<IFetchAllTasksResponse> => {
    return this.fetchAllTasks(obj);
  };

  protected createTaskService = async (obj: ICreateTaskServiceReqObj) => {
    const { board_id, title, description, user_id, assignee_id } = obj;

    const boardDetails = await this.boardService.fetchBoardByIdDb(board_id);

    if (!boardDetails) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Board not found!",
      });
    }

    const taskSlug = this.generateSlug(boardDetails.name);

    const taskObj: ICreateTaskDbReqObj = {
      board_id,
      slug: taskSlug,
      title,
      assignee_id,
      description,
      status: TaskStatus.PENDING,
      created_by: user_id,
      created_at: moment().format(),
    };

    return this.createTaskDb(taskObj);
  };

  protected updateTaskStatusByIdService = async (
    obj: IUpdateTaskStatusReqObj
  ) => {
    const { user_id, id, status } = obj;

    const taskDetails = await this.fetchTaskByIdDb(id);

    if (!taskDetails) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Task not found!",
      });
    }

    return this.updateTaskStatusByIdDb({
      id,
      status,
      updated_by: user_id,
      updated_at: moment().format(),
    });
  };

  protected updateTaskByIdService = async (obj: IUpdateTaskServiceReqObj) => {
    const { user_id, id, ...updateFields } = obj;

    const taskDetails = await this.fetchTaskByIdDb(id);

    if (!taskDetails) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Task not found!",
      });
    }

    // Only include fields that are provided
    const updateObj: any = {
      id,
      updated_by: user_id,
      updated_at: moment().format(),
    };

    if (updateFields.title !== undefined) {
        Object.assign(updateObj, {
            title: updateFields.title
        })
    }

    if (updateFields.description !== undefined) {
        Object.assign(updateObj, {
            description: updateFields.description
        })
    }

    if (updateFields.status !== undefined) {
        Object.assign(updateObj, {
            status: updateFields.status
        })
    }

    if (updateFields.assignee_id !== undefined) {
        Object.assign(updateObj, {
            assignee_id: updateFields.assignee_id
        })
    }



    return this.updateTaskByIdDb(updateObj);
  };

  protected deleteTaskByIdService = async (obj: IDeleteTaskServiceReqObj) => {
    const { user_id, id } = obj;

    const taskDetails = await this.fetchTaskByIdDb(id);

    if (!taskDetails) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Task not found!",
      });
    }

    return this.deleteTaskByIdDb({
      id,
      updated_by: user_id,
      updated_at: moment().format(),
    });
  };
}
