import { Router } from "express";
import { bookingController } from "./booking.controller";
const router = Router();

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:customer_id", bookingController.getBookingsForSpecificCustomer);
router.put("/:id", bookingController.updateBooking);

export const bookingRoutes = router;