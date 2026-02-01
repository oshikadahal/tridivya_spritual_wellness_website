import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDto } from '../dtos/user.dto';
import { Request, Response } from 'express';
import z from 'zod';

const userService = new UserService();

function prettifyZodError(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ');
}

export class AdminUserController {
  // POST /api/admin/users - Create new user
  async createUser(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsedData.error) });
      }
      
      const userData: any = parsedData.data;
      
      // Add image if uploaded
      if (req.file) {
        userData.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const newUser = await userService.createUser(userData);
      return res.status(201).json({ success: true, message: 'User Created', data: newUser });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // GET /api/admin/users - Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // GET /api/admin/users/:id - Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      return res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  // PUT /api/admin/users/:id - Update user
  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const parsedData = UpdateUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsedData.error) });
      }
      
      // Add image if uploaded
      if (req.file) {
        parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedUser = await userService.updateUser(userId, parsedData.data);
      return res.status(200).json({ success: true, data: updatedUser, message: "User updated successfully" });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  // DELETE /api/admin/users/:id - Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const deleted = await userService.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
