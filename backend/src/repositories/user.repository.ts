import { UserModel, IUser } from '../models/user.model';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  getUsersPaginated(page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  setResetToken(id: string, tokenHash: string, expiresAt: Date): Promise<IUser | null>;
  getUserByResetToken(tokenHash: string): Promise<IUser | null>;
  clearResetToken(id: string): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async getUsersPaginated(page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(),
    ]);
    return { users, total };
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async setResetToken(id: string, tokenHash: string, expiresAt: Date): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { resetPasswordToken: tokenHash, resetPasswordExpires: expiresAt },
      { new: true }
    );
  }

  async getUserByResetToken(tokenHash: string): Promise<IUser | null> {
    return await UserModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async clearResetToken(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { resetPasswordToken: undefined, resetPasswordExpires: undefined },
      { new: true }
    );
  }
}
