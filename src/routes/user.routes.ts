import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Admin-only endpoints
router.use(protect, authorize("admin"));

router.get("/", UserController.listUsers);              // all users
router.get("/receivers", UserController.listReceivers); // only receivers
router.get("/senders", UserController.listSenders);     // only senders
router.patch("/block/:id", UserController.blockUser);   // block/unblock
router.get("/blocked", UserController.listBlockedUsers); //only admin

export default router;
