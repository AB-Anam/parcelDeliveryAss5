// src/routes/admin.routes.ts
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { getAdminDashboard } from "../controllers/adminDashboard.controller";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getAdminDashboard
);

export default router;
