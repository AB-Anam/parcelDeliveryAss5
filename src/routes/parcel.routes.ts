import { Router } from "express";
import * as ParcelController from "../controllers/parcel.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/* ----------------------------------------------
   📦 PUBLIC ROUTES
---------------------------------------------- */

// Track parcel by tracking ID
router.get("/track/:trackingId", ParcelController.trackParcelController);

/* ----------------------------------------------
   📬 SENDER ROUTES
---------------------------------------------- */

// Create parcel
router.post(
  "/",
  protect,
  authorize("sender"),
  ParcelController.createParcelController
);

// Sender: Assign receiver (request delivery)
router.post(
  "/deliver",
  protect,
  authorize("sender"),
  ParcelController.deliverParcelController
);

// Cancel parcel
router.patch(
  "/cancel/:id",
  protect,
  authorize("sender"),
  ParcelController.cancelParcelController
);

// Get parcels belonging to logged-in sender
router.get(
  "/me",
  protect,
  ParcelController.getMyParcelsController
);

/* ----------------------------------------------
   📥 RECEIVER ROUTES
---------------------------------------------- */

// Receiver confirms delivery
router.patch(
  "/confirm/:id",
  protect,
  authorize("receiver"),
  ParcelController.confirmDeliveryController
);

/* ----------------------------------------------
   👑 ADMIN ROUTES
---------------------------------------------- */

// Get all parcels
router.get(
  "/",
  protect,
  authorize("admin"),
  ParcelController.getAllParcelsController
);

// Admin updates parcel status
router.patch(
  "/status/:id",
  protect,
  authorize("admin"),
  ParcelController.updateParcelStatusController
);

// Block / unblock parcel
router.patch(
  "/block/:id",
  protect,
  authorize("admin"),
  ParcelController.blockParcelController
);

/* ----------------------------------------------
   📜 HISTORY ROUTE
---------------------------------------------- */

// Get tracking history for a parcel
router.get(
  "/history/:id",
  protect,
  ParcelController.getParcelHistoryController
);

export default router;
