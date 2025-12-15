import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
const router = Router();

router.post("/", auth(), bookingController.createBooking);
router.get("/", auth(), bookingController.getAllBookings);
router.get("/:customer_id", bookingController.getBookingsForSpecificCustomer);
router.put("/:id", auth(), bookingController.updateBooking);

export const bookingRoutes = router;