import logger from '#config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#services/users.service.js';
import { formatValidationError } from '#utils/format.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');
    const allUsers = await getAllUsers();
    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const fetchUserById = async (req, res) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Getting user with ID: ${id}`);
    
    const user = await getUserById(id);
    
    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to retrieve user'
    });
  }
};

export const updateUserById = async (req, res) => {
  try {
    // Validate user ID
    const idValidationResult = userIdSchema.safeParse(req.params);
    if (!idValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idValidationResult.error),
      });
    }

    // Validate update data
    const bodyValidationResult = updateUserSchema.safeParse(req.body);
    if (!bodyValidationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidationResult.error),
      });
    }

    const { id } = idValidationResult.data;
    const updates = bodyValidationResult.data;
    const currentUser = req.user;

    // Authorization checks
    const isOwnProfile = currentUser.id === id;
    const isAdmin = currentUser.role === 'admin';

    // Users can only update their own profile, admins can update anyone
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own profile'
      });
    }

    // Only admins can change roles
    if (updates.role && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles'
      });
    }

    logger.info(`Updating user with ID: ${id} by user: ${currentUser.email}`);
    
    const updatedUser = await updateUser(id, updates);
    
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The user you are trying to update does not exist'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update user'
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const currentUser = req.user;

    // Authorization checks
    const isOwnProfile = currentUser.id === id;
    const isAdmin = currentUser.role === 'admin';

    // Users can delete their own profile, admins can delete anyone
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own profile'
      });
    }

    // Prevent admins from deleting themselves (optional safety check)
    if (isOwnProfile && isAdmin) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Administrators cannot delete their own account'
      });
    }

    logger.info(`Deleting user with ID: ${id} by user: ${currentUser.email}`);
    
    const deletedUser = await deleteUser(id);
    
    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The user you are trying to delete does not exist'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete user'
    });
  }
};
