import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
  const startDate = new Date(rent_start_date as Date).getTime();
  const endDate = new Date(rent_end_date as Date).getTime();
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const totalPrice = vehicle.rows[0].daily_rent_price * (totalDays + 1);

  const result = await pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, "active"]);

  return {
    result,
    vehicle: vehicle.rows[0]
  };
}

const getAllBookings = async () => {
  const allBookings = await pool.query(`SELECT * FROM bookings`);

  const result = [] as any[];

  for (const booking of allBookings.rows) {
    const customerId = booking.customer_id;
    const vehicleId = booking.vehicle_id;

    const customer = await pool.query(`SELECT * FROM users WHERE id=$1`, [customerId]);
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);

    result.push({
      ...booking,
      customer: {name: customer.rows[0].name, email: customer.rows[0].email},
      vehicle: {vehicle_name: vehicle.rows[0].vehicle_name, registration_number: vehicle.rows[0].registration_number}
    })
  }

  return result;
}

const updateBooking = async(payload: Record<string, unknown>) => {
  const {status, id} = payload;
  const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);

  return result;
}

const getBookingsForSpecificCustomer = async(customer_id: string) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 AND status=$2`, [customer_id, "active"]);
  return result;
}

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
  getBookingsForSpecificCustomer
}