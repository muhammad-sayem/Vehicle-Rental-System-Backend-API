import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

// Create Vehicle //
const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    console.log("Checle created, ", result);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0]
    })
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get All Vehicles
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows
    })
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Get Single Vehicle //
const getSingleVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await vehicleServices.getSingleVehicle(id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found"
      });
    }
    else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0]
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

// Update Vehicle //
const updateVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = { ...req.body, id };

  try {
    const result = await vehicleServices.updateVehicle(payload);
    console.log("Vehicle update console", result);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0]
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

// Update Vehicle Status //
const updateVehicleStatus = async (req: Request, res: Response) => {
  const result = await vehicleServices.updateVehicleStatus(req.params.id as string);
  return result;
}

// Delete Vehicle //
const deleteVehicle = async (req: Request, res: Response) => {

  try {
    const id = req.params.id;
    const result = await vehicleServices.deleteVehicle(id as string);
    console.log("Vehicle result console", result);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully"
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

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle
}