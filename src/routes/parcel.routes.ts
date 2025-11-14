// routes/parcel.route.ts
import { Router } from "express";
import * as ParcelController from "../controllers/parcel.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// 🌐 Public tracking endpoint
router.get("/track/:trackingId", ParcelController.trackParcelController);

// ✉️ Sender-only
router.post("/", protect, authorize("sender"), ParcelController.createParcelController);
router.get("/me", protect, authorize("sender", "receiver"), ParcelController.getMyParcelsController);
router.patch("/cancel/:id", protect, authorize("sender"), ParcelController.cancelParcelController);

// ✅ Deliver parcel (assign receiver) - sender action
router.patch("/deliver", protect, authorize("sender"), ParcelController.deliverParcelController);

// 🛎 Receiver-only
router.patch("/confirm/:id", protect, authorize("receiver"), ParcelController.confirmDeliveryController);

// 👑 Admin-only
router.use(protect, authorize("admin"));
router.patch("/status/:id", ParcelController.updateParcelStatusController);
router.patch("/block/:id", ParcelController.blockParcelController);
router.get("/", protect, authorize("admin"), ParcelController.getAllParcelsController);

// 📜 Delivery history (Sender or Receiver)
router.get("/history/:id", protect, authorize("sender", "receiver"), ParcelController.getParcelHistoryController);

export default router;
