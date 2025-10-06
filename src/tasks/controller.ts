  import customErrorHandler from "../utils/custom.error.handler";
  import TasksService from "./service";
  import { Request, Response } from "express";

  export default class TasksController extends TasksService {
    public fetchAllTasksController = async (req: Request, res: Response) => {
      try {
        const { search, filter_user_id } = req.query;
        const { board_id } = req.params;

        const result = await this.fetchAllTasksService({
          board_id: board_id,
          search: search as string,
          filter_user_id: filter_user_id as string,
        });

        res.status(200).json({
          success: true,
          message: "Tasks fetched successfully.",
          meta_data: {
            ...result.counts,
            total: result.total
          },
          data: result.tasks,
        });
      } catch (error) {
        customErrorHandler(res, error);
      }
    };

    public createTaskController = async (req: Request, res: Response) => {
      try {
        const { board_id, title, description, assignee_id, user_id } = req.body;

        await this.createTaskService({
          board_id,
          title,
          description,
          assignee_id,
          user_id,
        });

        res.status(201).json({
          success: true,
          message: "Task created successfully.",
        });
      } catch (error) {
        customErrorHandler(res, error);
      }
    };

    public updateTaskStatusByIdDbController = async (req: Request, res: Response) => {
      try {
        const {status, user_id} = req.body,
          {id} = req.params;

        await this.updateTaskStatusByIdService({
          id: parseInt(id),
          user_id,
          status
        })
        res.status(200).json({
          success: true,
          message: "Task status updated successfully.",
        });
      } catch (error) {
        customErrorHandler(res, error);
      }
    };

    public updateTaskByIdController = async (req: Request, res: Response) => {
      try {
        const { title, description, status, user_id, assignee_id } = req.body;
        const { id } = req.params;

        await this.updateTaskByIdService({
          id: parseInt(id),
          title,
          description,
          status,
          user_id,
          assignee_id
        });

        res.status(200).json({
          success: true,
          message: "Task updated successfully.",
        });
      } catch (error) {
        customErrorHandler(res, error);
      }
    };

    public deleteTaskByIdController = async (req: Request, res: Response) => {
      try {
        const { user_id } = req.body;
        const { id } = req.params;

        await this.deleteTaskByIdService({
          id: parseInt(id),
          user_id,
        });

        res.status(200).json({
          success: true,
          message: "Task deleted successfully.",
        });
      } catch (error) {
        customErrorHandler(res, error);
      }
    };

    
  }
