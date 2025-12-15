import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { vehicleRoutes } from './modules/vehicle/vehicle.routes';
import { bookingRoutes } from './modules/booking/booking.routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();

// Parser //
app.use(express.json());

// Initialize Database //
initDB();

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Vehicle Rental Service API'
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use('/api/v1/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  })
});

export default app;