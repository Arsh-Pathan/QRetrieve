import { User, IUser } from '../models/User';

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }),
  findById: (id: string) => User.findById(id),
  create: (data: Partial<IUser>) => User.create(data),
};
