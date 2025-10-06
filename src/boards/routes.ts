import { Router } from "express";
import BoardsController from "./controller";
import {
  validateFetchAllBoards,
  validateFetchBoardById,
  validateCreateBoard,
  validateUpdateBoard,
  validateDeleteBoard,
} from "./validation";

const router = Router();

const { 
  fetchAllBoardsController, 
  fetchBoardByIdController, 
  createBoardController, 
  updateBoardByIdController, 
  deleteBoardByIdController 
} = new BoardsController();

/**
 * - GET /api/v1/boards
 * - GET /api/v1/boards/:id
 * - POST /api/v1/boards
 * - PATCH /api/v1/boards/:id
 * - DELETE /api/v1/boards/:id
 */

router.get("/", validateFetchAllBoards, fetchAllBoardsController);

router.get("/:id", validateFetchBoardById, fetchBoardByIdController);

router.post("/", validateCreateBoard, createBoardController);

router.patch("/:id", validateUpdateBoard, updateBoardByIdController);

router.delete("/:id", validateDeleteBoard, deleteBoardByIdController);

export default router;
