import { Request, Response } from "express";
import { userServices } from "./user.service";
import { bookingService } from "../booking/booking.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    const users = result.rows;
    console.log(users);

    users.forEach((user) => {
      delete user.password;
      return user
    });

    // console.log("Users withiout pass", usersWithoutPassword);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    })
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userServices.getSingleUser(id as string);
    const user = result.rows[0];
    delete user.password;

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }
    else {
      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user
      })
    }

  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = { ...req.body, id };
  const loggedInUser: any = req.user;

  // console.log({loggedInUser});
  if (loggedInUser.role === "customer" && String(loggedInUser.id) !== String(id)) {
    return res.status(403).json({
      success: false,
      message: "Not allowed to another customer's information update"
    })
  }

  try {
    const userRole = loggedInUser.role;

    const isAdmin: boolean = userRole === "admin" ? true : false;
    if(!isAdmin){
      delete payload.role;
    }

    const result = await userServices.updateUser(payload, userRole);
    console.log("user result console", result);

    if (result?.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    else {
      const user = result?.rows[0];
      // console.log("User update console", user);
      delete user.password;

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
      })
    }
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const userForDelete = (await userServices.getSingleUser(id as string)).rows[0];
    console.log({ userForDelete });

    const isExist = await bookingService.getBookingsForSpecificCustomer(userForDelete.id);
    console.log("Is Exist or not", isExist.rows);

    if (isExist.rows.length !== 0) {
      return res.status(404).json({
        success: false,
        message: "Can't delete user because of active booking status"
      })
    }

    const result = await userServices.deleteUser(id as string);
    console.log("Deleting result", result);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully"
      })
    }
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
}