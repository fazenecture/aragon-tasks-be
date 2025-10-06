import {Router} from "express";
import taskRouter from "../tasks/routes";
import boardRouter from "../boards/routes";
import authMiddleware from "../utils/auth.middleware";

const router = Router();


/**
 * - Routes
 * - GET /api/v1/boards
 * - GET /api/v1/boards/:id
 * - POST /api/v1/boards
 * - PATCH /api/v1/boards/:id
 * - DELETE /api/v1/boards/:id
 * 
 * - GET /api/v1/:board_id/tasks
 * - GET /api/v1/tasks/:id
 * - POST /api/v1/tasks
 * - PATCH /api/v1/tasks/:id
 * - DELETE /api/v1/tasks/:id
 */

router.use(authMiddleware);
router.use("/tasks", taskRouter);
router.use("/boards", boardRouter);



export default router;