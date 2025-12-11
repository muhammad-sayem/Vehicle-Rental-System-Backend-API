import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    console.log("Booking Created", result.result);
    const bookingData = result.result.rows[0];
    const vehicleData = result.vehicle;

    // customer_id, vehicle_id, rent_start_date, rent_end_date
    const resposneData = {
      id: bookingData.id,
      customer_id: bookingData.customer_id,
      vehicle_id: bookingData.vehicle_id,
      rent_start_date: new Date(bookingData.rent_start_date).toISOString().split("T")[0],
      rent_end_date: new Date(bookingData.rent_end_date).toISOString().split("T")[0],
      total_price: bookingData.total_price,
      status: bookingData.status,
      vehicle: {
        vehicle_name: vehicleData.vehicle_name,
        daily_rent_price: vehicleData.daily_rent_price
      }
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: resposneData
    })
  }

  catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Booking created successfully",
      data: error.message
    })
  }
}

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result
    })
  }
  catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = { ...req.body, id };

  try {
    const result = await bookingService.updateBooking(payload);
    console.log(result);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Booking not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully"
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

const getBookingsForSpecificCustomer = async (req: Request, res: Response) => {
  const id = req.params.customer_id;
  
  try {
    const result = await bookingService.getBookingsForSpecificCustomer(id as string);
    console.log(result);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Booking Found"
      });
    }

    else {
      res.status(200).json({
        success: true,
        message: "Bookings by specific customer retrieved successfully",
        data: result.rows
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

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
  getBookingsForSpecificCustomer
} 