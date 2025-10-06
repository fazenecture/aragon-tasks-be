import customErrorHandler from "../utils/custom.error.handler";
import BoardsService from "./service";
import { Request, Response } from "express";

export default class BoardsController extends BoardsService {

  public fetchAllBoardsController = async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      const { user_id } = req.body;

      const result = await this.fetchAllBoardsService({
        search: search as string,
        user_id: user_id,
      });

      res.status(200).json({
        success: true,
        message: "Boards fetched successfully.",
        data: result,
      });
    } catch (error) {
      customErrorHandler(res, error);
    }
  }

  public fetchBoardByIdController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await this.fetchBoardByIdService(parseInt(id));

      res.status(200).json({
        success: true,
        message: "Board fetched successfully.",
        data: result,
      });
    } catch (error) {
      customErrorHandler(res, error);
    }
  }

  public createBoardController = async (req: Request, res: Response) => {
    try {
      const { name, description, user_id } = req.body;

      await this.createBoardService({
        name,
        description,
        user_id,
      });

      res.status(201).json({
        success: true,
        message: "Board created successfully.",
      });
    } catch (error) {
      customErrorHandler(res, error);   
    }
  }

  public updateBoardByIdController = async (req: Request, res: Response) => {
    try {
      const { name, description, user_id } = req.body;
      const { id } = req.params;

      await this.updateBoardByIdService({
        id: parseInt(id),
        name,
        description,
        user_id,
      });

      res.status(200).json({
        success: true,
        message: "Board updated successfully.",
      });
    } catch (error) {
      customErrorHandler(res, error);
    }
  }

  public deleteBoardByIdController = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;
      const { id } = req.params;

      await this.deleteBoardByIdService({
        id: parseInt(id),
        user_id,
      });

      res.status(200).json({
        success: true,
        message: "Board deleted successfully.",
      });
    } catch (error) {
      customErrorHandler(res, error);
    }
  }

}
