import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Admin-only endpoints
router.use(protect, authorize("admin"));

router.get("/", UserController.listUsers);
router.patch("/block/:id", UserController.blockUser);

export default router;
