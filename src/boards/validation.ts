import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateFetchAllBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bodySchema = Joi.object({
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
        errors: error,
    });
  }
};

export const validateFetchBoardById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
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

export const validateCreateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bodySchema = Joi.object({
      name: Joi.string().min(1).max(255).required(),
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

export const validateUpdateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.number().integer().positive().required(),
    });

    const bodySchema = Joi.object({
      name: Joi.string().min(1).max(255).optional(),
      description: Joi.string().allow(null, "").optional(),
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

export const validateDeleteBoard = async (
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
