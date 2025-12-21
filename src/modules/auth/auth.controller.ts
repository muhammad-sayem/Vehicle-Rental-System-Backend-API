import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    console.log("User Info", req.body);

    const user = result.rows[0];
    delete user.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    })
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    const token = result?.token;
    const user = result?.user;
    delete user.password

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token, user }
    })
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const authController = {
  createUser,
  loginUser
}