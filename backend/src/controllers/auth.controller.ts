import { UserService } from '../services/user.service';
import { CreateUserDTO, LoginUserDTO, UpdateUserDto, ForgotPasswordDTO, ResetPasswordDTO, ChangePasswordDTO } from '../dtos/user.dto';
import { Request, Response } from 'express';
import z from 'zod';

const userService = new UserService();

function prettifyZodError(error: z.ZodError) {

  // Return a concise message joining all issue messages with their paths
  return error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ');
}

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsedData.error) });
      }
      const userData: CreateUserDTO = parsedData.data;
      const newUser = await userService.createUser(userData);
      return res.status(201).json({ success: true, message: 'User Created', data: newUser });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsed = LoginUserDTO.safeParse(req.body);
      if (!parsed.success) {
        console.error('Zod login issues:', parsed.error.issues);
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }
      const loginData: LoginUserDTO = parsed.data;
      const { token, user } = await userService.loginUser(loginData);
      return res.status(200).json({ success: true, message: 'Login successful', data: user, token });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const parsed = ForgotPasswordDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      await userService.requestPasswordReset(parsed.data.email);
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a reset link has been sent.',
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const parsed = ResetPasswordDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      await userService.resetPassword(parsed.data.token, parsed.data.password);
      return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID not found in request' });
      }

      const parsed = ChangePasswordDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }

      await userService.changePassword(
        userId,
        parsed.data.currentPassword,
        parsed.data.newPassword
      );

      return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }

   async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user ?._id;
      if (!userId) {
        return res.status (400) .json (
          { success: false, message: 'User ID not found in request' }
        );
      }

      const user = await userService .getUserById (userId);
      return res.status(200).json (
        { success: true, message: 'User profile fetched successfully', data: user }
      )

    } catch (error : Error | any ){
      return res.status(error.statusCode ?? 500).json(
        { success: false, message: error.message || 'Internal Server Error' });
    }
  }


  async updateProfile(req: Request, res: Response) {
        try{
            const userId = req.user?._id;
            if(!userId){
                return res.status(400).json(
                    { success: false, message: "User Id Not found" }
                );
            }
            const parsedData = UpdateUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: prettifyZodError(parsedData.error) }
                );
            }
            if(req.file){
                parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
            }
            const updatedUser = await userService.updateUser(userId, parsedData.data);
            return res.status(200).json(
                { success: true, data: updatedUser, message: "User profile updated successfully" }
            );
        }catch(error: Error | any){
            return res.status(error.statusCode || 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

  async uploadProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json(
          { success: false, message: "User ID not found" }
        );
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json(
          { success: false, message: "No file uploaded" }
        );
      }

      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json(
          { success: false, message: "Only JPG, JPEG, and PNG files are allowed" }
        );
      }

      // Validate file size (max 5MB)
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxFileSize) {
        return res.status(400).json(
          { success: false, message: "File size must be less than 5MB" }
        );
      }

      // Update user with new profile picture
      const profilePictureUrl = `/uploads/${req.file.filename}`;
      const updatedUser = await userService.updateUser(userId, {
        imageUrl: profilePictureUrl
      });

      return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: {
          ...updatedUser,
          profilePictureUrl: profilePictureUrl
        }
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json(
        { success: false, message: error.message || "Internal Server Error" }
      );
    }
  }

  async deleteProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(400).json(
          { success: false, message: "User ID not found" }
        );
      }

      // Update user with empty image URL
      const updatedUser = await userService.updateUser(userId, {
        imageUrl: ""
      });

      return res.status(200).json({
        success: true,
        message: "Profile picture deleted successfully",
        data: updatedUser
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json(
        { success: false, message: error.message || "Internal Server Error" }
      );
    }
  }

}
