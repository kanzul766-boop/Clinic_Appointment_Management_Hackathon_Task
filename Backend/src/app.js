import express  from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import doctorRegistrationRoutes from "./routes/doctor-registration.routes.js";
import postRoutes from "./routes/post.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
const app = express();
const frontendOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
  app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Clinic Appointment Management API is running"
  });
});
app.use(cors({
  origin: frontendOrigins.length ? frontendOrigins : false,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(
  [
    "/auth",
    "/api/auth",
    "/doctor",
    "/post",
    "/doctors",
    "/api/doctors",
    "/appointments",
    "/api/appointments",
    "/admin",
    "/api/admin",
    "/notifications",
    "/api/profile",
  ],
  async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error("Database connection failed:", error);
      res.status(503).json({ message: "Database unavailable" });
    }
  },
);

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/doctor", doctorRegistrationRoutes);
app.use("/post", postRoutes);
app.use("/doctors", doctorRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/admin", adminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);

export default app;