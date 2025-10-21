import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authenticate, requireAdmin } from '#middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, fetchAllUsers);

// Get user by ID (authenticated users can view any user)
router.get('/:id', authenticate, fetchUserById);

// Update user by ID (users can update themselves, admins can update anyone)
router.put('/:id', authenticate, updateUserById);

// Delete user by ID (users can delete themselves, admins can delete anyone)
router.delete('/:id', authenticate, deleteUserById);

export default router;
