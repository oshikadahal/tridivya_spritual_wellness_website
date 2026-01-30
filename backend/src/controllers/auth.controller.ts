import { UserService } from '../services/user.service';
import { CreateUserDTO, LoginUserDTO , UpdateUserDto} from '../dtos/user.dto';
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

}
