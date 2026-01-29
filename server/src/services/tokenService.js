import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/env.js';
import prisma from '../config/database.js';

// Generate Access Token (short-lived)
export function generateAccessToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role?.name || 'user',
        },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpiry }
    );
}

// Generate Refresh Token (long-lived)
export async function generateRefreshToken(userId) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Store in database
    await prisma.refreshToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
}

// Verify and rotate refresh token
export async function verifyRefreshToken(token) {
    const refreshToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: { include: { role: true } } },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
        if (refreshToken) {
            // Delete expired token
            await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
        }
        return null;
    }

    return refreshToken.user;
}

// Invalidate refresh token (logout)
export async function invalidateRefreshToken(token) {
    try {
        await prisma.refreshToken.delete({ where: { token } });
        return true;
    } catch {
        return false;
    }
}

// Invalidate all refresh tokens for a user (logout all devices)
export async function invalidateAllUserTokens(userId) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
}

// Generate Email Verification Token
export async function generateEmailVerificationToken(userId) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    // Delete existing tokens for this user
    await prisma.emailVerificationToken.deleteMany({ where: { userId } });

    // Create new token
    await prisma.emailVerificationToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
}

// Verify Email Token
export async function verifyEmailToken(token) {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
        if (verificationToken) {
            await prisma.emailVerificationToken.delete({ where: { id: verificationToken.id } });
        }
        return null;
    }

    // Mark email as verified
    await prisma.user.update({
        where: { id: verificationToken.userId },
        data: { isEmailVerified: true },
    });

    // Delete token
    await prisma.emailVerificationToken.delete({ where: { id: verificationToken.id } });

    return verificationToken.user;
}

// Generate Password Reset Token
export async function generatePasswordResetToken(userId) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

    // Delete existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
        where: { userId, isUsed: false },
    });

    // Create new token
    await prisma.passwordResetToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
}

// Verify Password Reset Token
export async function verifyPasswordResetToken(token) {
    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!resetToken || resetToken.isUsed || resetToken.expiresAt < new Date()) {
        return null;
    }

    return resetToken;
}

// Mark Password Reset Token as Used
export async function markResetTokenUsed(tokenId) {
    await prisma.passwordResetToken.update({
        where: { id: tokenId },
        data: { isUsed: true },
    });
}
