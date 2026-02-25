import { CreateUserDTO, LoginUserDTO, UpdateUserDto } from '../dtos/user.dto';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../errors/http-error';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/email';
import { FRONTEND_URL } from '../config';

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

  async getAllUsers(page = 1, limit = 10) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const { users, total } = await userRepository.getUsersPaginated(safePage, safeLimit);
    return {
      users,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async deleteUser(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const deleted = await userRepository.deleteUser(userId);
    return deleted;
  }

  async requestPasswordReset(email: string) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return { sent: false };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.setResetToken(user.id, tokenHash, expiresAt);

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return { sent: true };
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.getUserByResetToken(tokenHash);
    if (!user) {
      throw new HttpError(400, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await userRepository.updateUser(user.id, { password: hashedPassword });
    await userRepository.clearResetToken(user.id);
    return { success: true };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const isCurrentValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new HttpError(400, 'Current password is incorrect');
    }

    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new HttpError(400, 'New password must be different from current password');
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await userRepository.updateUser(user.id, { password: hashedPassword });

    return { success: true };
  }
}
