import { Router } from "express";
import * as ParcelController from "../controllers/parcel.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Public tracking endpoint
router.get("/track/:trackingId", ParcelController.trackParcel);

// Sender-only
router.post("/", protect, authorize("sender"), ParcelController.createParcel);
router.get("/me", protect, authorize("sender", "receiver"), ParcelController.getMyParcels);
router.patch("/cancel/:id", protect, authorize("sender"), ParcelController.cancelParcel);

// Receiver-only
router.patch("/confirm/:id", protect, authorize("receiver"), ParcelController.confirmDelivery);

// Admin-only
router.use(protect, authorize("admin"));
router.patch("/status/:id", ParcelController.updateParcelStatus);
router.patch("/block/:id", ParcelController.blockParcel);
router.get("/", protect, authorize("admin"), ParcelController.getAllParcels);


// Delivery History (Sender or Receiver)
router.get("/history/:id", protect, authorize("sender", "receiver"), ParcelController.getParcelHistory);


export default router;
