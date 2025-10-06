/**
 * MOCK AUTH MIDDLEWARE
 */

import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In a real application, you would verify the token and extract user info
  // Here, we just mock it by adding a user_id to the request body
  try {
    // Ensure req.body exists before assigning
    if (!req.body) {
      req.body = {};
    }
    Object.assign(req.body, { user_id: 2 }); // Mock user_id
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;
