import { UserService } from '../services/user.service';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
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
      console.log('Register body:', req.body);
      const parsed = CreateUserDTO.safeParse(req.body);
      if (!parsed.success) {
        console.error('Zod register issues:', parsed.error.issues);
        return res.status(400).json({ success: false, message: prettifyZodError(parsed.error) });
      }
      const userData: CreateUserDTO = parsed.data;
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
}
