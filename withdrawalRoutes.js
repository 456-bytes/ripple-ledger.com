// withdrawalRoutes.js
import express from "express";
const router = express.Router();
import { requireAuth } from "./middleWare/authMiddleware.js";
import Withdrawal from "./models/withdrawal.js";
// 👇 FIX: Import controller
import withdrawalController from "./controllers/withdrawalController.js";


// User creates withdrawal request
router.post("/withdrawals", requireAuth, async (req, res) => {
    try {
      const { method, address, amount, source } = req.body;
  
      if (!method || !address || !amount || !source) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const withdrawal = await Withdrawal.create({
        userId: req.userId, // comes from JWT middleware
        method,
        address,
        amount,
        source,
      });
  
      res.status(201).json({
        success: true,
        message: "Withdrawal request submitted",
        withdrawal,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // User submits withdrawal request
router.post("/withdrawals", requireAuth, withdrawalController.createWithdrawal);

  
  export default router;
