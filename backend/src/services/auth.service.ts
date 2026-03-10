import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';

const generateToken = (userId: string): string => {
  const secret: jwt.Secret = config.jwtSecret as jwt.Secret;
  const options: jwt.SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId }, secret, options);
};

export const authService = {
  register: async (data: { email: string; password: string; name: string; phone?: string }) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ApiError(409, 'Email already registered');

    const user = await userRepository.create(data);
    const token = generateToken(user._id as string);
    return { user, token };
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid email or password');

    const token = generateToken(user._id as string);
    return { user, token };
  },

  getProfile: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },
};
