import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../errors/http-error';

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserDTO) {
    const existing = await userRepository.getUserByEmail(data.email);
    if (existing) {
      throw new HttpError(403, 'Email already in use');
    }

    const hashed = await bcryptjs.hash(data.password, 10);
    const toCreate: Partial<any> = {
      name: data.name,
      email: data.email,
      password: hashed,
    };
    const newUser = await userRepository.createUser(toCreate as any);
    return newUser;
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
      name: (user as any).name,
      role: (user as any).role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return { token, user };
  }
}
