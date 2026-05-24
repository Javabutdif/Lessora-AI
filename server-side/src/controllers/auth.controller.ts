import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { loginUser, registerUser } from "../services/auth.service";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const user = await loginUser(input);
    res.json({ data: user, error: null });
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);
    res.status(200).json({ message: "Register Successful", error: null });
  } catch (error) {
    next(error);
  }
}
