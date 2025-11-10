import { Router } from 'express';
import { requireAuth, requireAdmin } from './middleWare/authMiddleware.js';
import adminController from './controllers/adminController.js';

const router = Router();

// 🧭 User Management
router.get('/users', requireAuth, requireAdmin, adminController.getUsers);
router.get('/users/:id/overview', requireAuth, requireAdmin, adminController.userOverview);
router.post('/users/:id/adjust', requireAuth, requireAdmin, adminController.adjustField);
router.delete('/users/:id', requireAuth, requireAdmin, adminController.deleteUser);

// 💸 Withdrawals
router.get('/withdrawals', requireAuth, requireAdmin, adminController.getWithdrawals);
router.post('/withdrawals/:id/status', requireAuth, requireAdmin, adminController.approveWithdrawal);

// 📨 Invites Management
router.get('/invites', requireAuth, requireAdmin, adminController.listInvites);
router.post('/invites', requireAuth, requireAdmin, adminController.createInvite);
router.post('/invites/:id/revoke', requireAuth, requireAdmin, adminController.revokeInvite);

export default router; // ✅ this must be at the END
