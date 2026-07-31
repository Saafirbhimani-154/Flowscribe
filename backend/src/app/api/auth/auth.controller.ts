import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthModel } from './auth.models';
import { AUTH_CONSTANTS } from './auth.constants';
import { AUTH_MESSAGES } from './auth.messages';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const existingUser = await AuthModel.findUserByEmail(email);
    const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    let user;

    if (existingUser) {
      if (existingUser.deletedAt !== null) {
        // Ghost logic: Soft deleted account rollback/restore
        user = await AuthModel.restoreUser(existingUser.id, {
          firstName,
          lastName,
          password: hashedPassword,
        });
      } else {
        return res.status(409).json({ error: AUTH_MESSAGES.ERROR.EMAIL_IN_USE });
      }
    } else {
      // Generate base slug
      let baseSlug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const slugId = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      
      const defaultRole = await AuthModel.findRoleByName('Workspace Owner');
      if (!defaultRole) {
        return res.status(500).json({ error: AUTH_MESSAGES.ERROR.DEFAULT_ROLE_MISSING });
      }

      user = await AuthModel.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        slugId,
        roleId: defaultRole.id,
      });
    }

    const token = jwt.sign({ userId: user.id }, AUTH_CONSTANTS.JWT_SECRET as string, { 
      expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN as any
    });

    res.cookie('flowscribe_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: existingUser ? AUTH_MESSAGES.SUCCESS.RESTORED : AUTH_MESSAGES.SUCCESS.REGISTERED,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        slugId: user.slugId,
        roleId: user.roleId
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: AUTH_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await AuthModel.findUserByEmail(email);
    
    if (!user || user.deletedAt !== null || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS });
    }

    const token = jwt.sign({ userId: user.id }, AUTH_CONSTANTS.JWT_SECRET as string, { 
      expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN as any
    });

    res.cookie('flowscribe_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: AUTH_MESSAGES.SUCCESS.LOGGED_IN,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        slugId: user.slugId,
        roleId: user.roleId
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: AUTH_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};
