import { Router } from "express";
import TasksController from "./controller";
import {
  validateFetchAllTasks,
  validateCreateTask,
  validateUpdateTaskStatus,
  validateUpdateTask,
  validateDeleteTask,
} from "./validation";

const router = Router();

const { fetchAllTasksController, createTaskController, updateTaskStatusByIdDbController, updateTaskByIdController, deleteTaskByIdController } = new TasksController();

/**
 * - GET /api/v1/tasks/board/:board_id
 * - GET /api/v1/tasks/:id
 * - POST /api/v1/tasks
 * - PATCH /api/v1/tasks/:id
 * - DELETE /api/v1/tasks/:id
 */

router.get("/:board_id", validateFetchAllTasks, fetchAllTasksController);

router.post("/", validateCreateTask, createTaskController);

router.patch("/status/:id", validateUpdateTaskStatus, updateTaskStatusByIdDbController);

router.patch("/:id", validateUpdateTask, updateTaskByIdController);

router.delete("/:id", validateDeleteTask, deleteTaskByIdController);

// router.get("/", );

// router.get("/:id", );

// router.post("/", );

// router.patch("/:id", );

// router.delete("/:id", );

export default router;
