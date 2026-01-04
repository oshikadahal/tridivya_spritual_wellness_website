import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../errors/http-error';

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserDTO) {
    console.log('UserService.createUser input:', data);
    // business logic checks
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, 'Email already in use');
    }
    const usernameCheck = await userRepository.getUserByUsername(data.username);
    if (usernameCheck) {
      throw new HttpError(403, 'Username already in use');
    }

    // hash password
    const hashed = await bcryptjs.hash(data.password, 10);
    const toCreate: Partial<any> = {
      username: data.username,
      email: data.email,
      password: hashed,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    try {
      const newUser = await userRepository.createUser(toCreate as any);
      console.log('UserService.createUser result:', newUser);
      return newUser;
    } catch (err: any) {
      console.error('UserService.createUser error:', err);
      throw err;
    }
  }

  async loginUser(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const valid = await bcryptjs.compare(data.password, user.password);
    if (!valid) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const payload = {
      id: user._id,
      email: user.email,
      username: (user as any).username,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      role: (user as any).role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return { token, user };
  }
}
