import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`, [vehicle_id]);

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle Already booked")
  };

  const startDate = new Date(rent_start_date as Date).getTime();
  const endDate = new Date(rent_end_date as Date).getTime();
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const totalPrice = vehicle.rows[0].daily_rent_price * (totalDays + 1);

  const result = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, "active"]);

  await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, ["booked", vehicle_id])

  return {
    result,
    vehicle: vehicle.rows[0]
  };
}

const getAllBookings = async (userRole: string, userId: string) => {

  const result = [] as any[];
  let allBookings: any = [];

  if (userRole === "admin") {
    allBookings = await pool.query(`SELECT * FROM bookings`);
    // console.log({ allBookings: allBookings.rows });
  }

  else {
    allBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [userId]);
    // console.log({ allBookings: allBookings.rows });
  }

  for (const booking of allBookings.rows) {
    const customerId = booking.customer_id;
    const vehicleId = booking.vehicle_id;

    const customer = await pool.query(`SELECT * FROM users WHERE id=$1`, [customerId]);
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);

    result.push({
      ...booking,
      rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
      rent_end_date: booking.rent_end_date.toISOString().split("T")[0],

      customer: { name: customer.rows[0].name, email: customer.rows[0].email },
      vehicle: { vehicle_name: vehicle.rows[0].vehicle_name, registration_number: vehicle.rows[0].registration_number }
    })
  }

  return result;


}

const updateBooking = async (payload: Record<string, unknown>) => {
  const { bookingId, status, loggedInUserId, loggedInUserRole } = payload;

  const bookingCheck = await pool.query(`SELECT rent_start_date, rent_end_date, vehicle_id, status FROM bookings WHERE id=$1`, [bookingId]);

  if(bookingCheck.rows.length === 0){
    throw new Error("Booking not found")
  }

  const today = new Date();
  const rentEndDate = new Date(bookingCheck.rows[0].rent_end_date);

  if(today > rentEndDate && bookingCheck.rows[0].status !== "returned"){
    await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [bookingId]);

    await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [bookingCheck.rows[0].vehicle_id]);
  }

  if (loggedInUserRole === "customer") {
    if (status != "cancelled") {
      throw new Error("Customer can only cancel booking")
    }

    else {
      const bookingDateAndVehilceIdCheck = await pool.query(`SELECT vehicle_id, rent_start_date FROM bookings WHERE id=$1 AND customer_id=$2`, [bookingId, loggedInUserId]);

      if (bookingDateAndVehilceIdCheck.rows.length === 0) {
        throw new Error("Bookign not found")
      }

      else {
        const { vehicle_id, rent_start_date } = bookingDateAndVehilceIdCheck.rows[0];
        const rentStartDate = new Date(rent_start_date);
        const today = new Date();

        if (today >= rentStartDate) {
          throw new Error("You can't cancel booking when the rent start day started")
        }

        else {
          const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 AND customer_id=$3 RETURNING *, to_char(rent_start_date, 'YYYY-MM-DD') AS rent_start_date, to_char(rent_end_date, 'YYYY-MM-DD') AS rent_end_date`, [status, bookingId, loggedInUserId]);

          await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [vehicle_id]);

          return {
            booking: result.rows[0],
            vehicle: {
              availability_status: "available"
            }
          };
        }
      }
    }
  }

  if (loggedInUserRole === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only return booking")
    }

    else {
      const bookingResult = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *, to_char(rent_start_date, 'YYYY-MM-DD') AS rent_start_date, to_char(rent_end_date, 'YYYY-MM-DD') AS rent_end_date`, [status, bookingId]);

      if (bookingResult.rows.length === 0) {
        throw new Error("Booking Not Found");
      }

      const vehicleId = bookingResult.rows[0].vehicle_id;

      const returnedVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, ["available", vehicleId]);

      return {
        booking: bookingResult.rows[0],
        vehicle: returnedVehicle.rows[0]
      };
    }

  }


}

const getBookingsForSpecificCustomer = async (customer_id: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 AND status=$2`, [customer_id, "active"]);
  return result;
}

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
  getBookingsForSpecificCustomer
}