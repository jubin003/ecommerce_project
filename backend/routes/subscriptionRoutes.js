import express from "express";
import { getPlans, assignSubscription, checkUserSubscription } from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/", getPlans); // list all plans
router.post("/assign", assignSubscription); // assign plan to user
router.get("/user/:userId", checkUserSubscription); // check if user has subscription

export default router;
