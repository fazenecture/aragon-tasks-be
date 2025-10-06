import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { TaskStatus } from "./types/enums";

export const validateFetchAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsSchema = Joi.object({
      board_id: Joi.number().integer().positive().required(),
    });

    req.params = await paramsSchema.validateAsync(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });


    next();
  } catch (error: any) {
    res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: (error?.details || []).map((d: any) => d.message),
    });
  }
};

export const validateCreateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bodySchema = Joi.object({
      board_id: Joi.number().integer().positive().required(),
      title: Joi.string().min(1).max(255).required(),
      description: Joi.string().allow(null, "").optional(),
      user_id: Joi.number().required(),
    });

    req.body = await bodySchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error: any) {
    res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: (error?.details || []).map((d: any) => d.message),
    });
  }
};

export const validateUpdateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    });

    const bodySchema = Joi.object({
      status: Joi.string().valid(
        TaskStatus.PENDING,
        TaskStatus.IN_PROGRESS,
        TaskStatus.COMPLETED
      ).required(),
      user_id: Joi.number().required(),
    });

    req.params = await paramsSchema.validateAsync(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = await bodySchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error: any) {
    res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: (error?.details || []).map((d: any) => d.message),
    });
  }
};

export const validateUpdateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    });

    const bodySchema = Joi.object({
      title: Joi.string().min(1).max(255).optional(),
      description: Joi.string().allow(null, "").optional(),
      status: Joi.string().valid(
        TaskStatus.PENDING,
        TaskStatus.IN_PROGRESS,
        TaskStatus.COMPLETED
      ).optional(),
      user_id: Joi.number().required(),
    });

    req.params = await paramsSchema.validateAsync(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = await bodySchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error: any) {
    res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: (error?.details || []).map((d: any) => d.message),
    });
  }
};

export const validateDeleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    });

    const bodySchema = Joi.object({
      user_id: Joi.number().required(),
    });

    req.params = await paramsSchema.validateAsync(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = await bodySchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error: any) {
    res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: (error?.details || []).map((d: any) => d.message),
    });
  }
};
