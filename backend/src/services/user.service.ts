import { CreateUserDTO, LoginUserDTO ,UpdateUserDto} from '../dtos/user.dto';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../errors/http-error';

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserDTO) {
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
      username: (user as any).username,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      role: (user as any).role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return { token, user };
  }

  async getUserById(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }


  async updateUser(userId: string, data: UpdateUserDto) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        if(user.email !== data.email){
            const emailExists = await userRepository.getUserByEmail(data.email!);
            if(emailExists){
                throw new HttpError(403, "Email already in use");
            }
        }
        if(user.username !== data.username){
            const usernameExists = await userRepository.getUserByUsername(data.username!);
            if(usernameExists){
                throw new HttpError(403, "Username already in use");
            }
        }
        if(data.password){
            const hashedPassword = await bcryptjs.hash(data.password, 10);
            data.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUser(userId, data);
        return updatedUser;
    }

  async getAllUsers() {
    const users = await userRepository.getAllUsers();
    return users;
  }

  async deleteUser(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const deleted = await userRepository.deleteUser(userId);
    return deleted;
  }
}
