import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../src/db/db.js";
import userModel from "../src/models/users.model.js";

const DEMO_DOCTOR = {
  userName: "demoDrAvery",
  email: "demo.avery@clinic.local",
  role: "doctor",
  doctorApprovalStatus: "approved",
  specialization: "Cardiology",
  experience: 12,
  isActive: true,
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function provisionDemoDoctor() {
  if (process.env.NODE_ENV !== "production") {
    throw new Error("NODE_ENV must be production");
  }
  if (process.env.PROVISION_DEMO_DOCTOR !== "true") {
    throw new Error("Set PROVISION_DEMO_DOCTOR=true to confirm provisioning");
  }

  const password = process.env.DEMO_DOCTOR_PASSWORD;
  if (!password) {
    throw new Error("DEMO_DOCTOR_PASSWORD is required");
  }

  try {
    await connectDB();
    const existingUser = await userModel
      .findOne({
        $or: [
          {
            email: {
              $regex: `^${escapeRegExp(DEMO_DOCTOR.email)}$`,
              $options: "i",
            },
          },
          {
            userName: {
              $regex: `^${escapeRegExp(DEMO_DOCTOR.userName)}$`,
              $options: "i",
            },
          },
        ],
      })
      .select("_id role doctorApprovalStatus isActive");

    if (existingUser) {
      if (
        existingUser.role === DEMO_DOCTOR.role &&
        existingUser.doctorApprovalStatus === DEMO_DOCTOR.doctorApprovalStatus &&
        existingUser.isActive === DEMO_DOCTOR.isActive
      ) {
        console.log("Demo Doctor already exists; no changes made.");
        return;
      }
      throw new Error("A matching account already exists; no changes made");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await userModel.create({
      ...DEMO_DOCTOR,
      password: hashedPassword,
    });
    console.log("Demo Doctor created as active and approved.");
  } finally {
    await mongoose.disconnect();
  }
}

provisionDemoDoctor().catch((error) => {
  console.error("Demo Doctor provisioning failed:", error.name || "Error");
  process.exitCode = 1;
});
