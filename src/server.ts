import express, { Request, Response } from 'express';
import config from './config';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { vehicleRoutes } from './modules/vehicle/vehicle.routes';
import { bookingRoutes } from './modules/booking/booking.routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();
const port = config.port;

// Parser //
app.use(express.json());

// Initialize Database //
initDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use('/api/v1/auth', authRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
