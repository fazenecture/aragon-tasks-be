import { Response } from "express";
import { ValidationError } from "joi";
import logger from "./logger";
import ErrorHandler from "./error.handler";

const customErrorHandler = async (res: Response, error: any) => {
    console.error(
      "❌ Error: ",
      JSON.stringify(error),
      error["Error"],
      error.toString()
    );

  logger.error(error);

  if (error instanceof ValidationError) {
    return res.header({ "x-frame-options": "deny" }).status(400).json({
      success: false,
      message: "Data validation failed",
      details: error.details,
    });
  }
  if (error instanceof ErrorHandler) {
    return res.status(error.status_code).send({
      success: false,
      message: error.message,
      data: error.data,
    });
  }

  res.status(500).send({
    success: false,
    message: error.toString().split("Error: ").pop() || "Internal ServerError.",
    error,
  });
};

export default customErrorHandler;
