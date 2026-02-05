import prisma from '../config/database.js';
import { logSecurityEvent, SecurityActions, SecurityStatus } from '../services/securityService.js';

/**
 * Get dashboard data with stats, recent activity, and favorites
 */
export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user with profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                preferences: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get calculation stats
        const totalCalculations = await prisma.calculation.count({
            where: { userId, isDeleted: false }
        });

        const savedCalculations = await prisma.calculation.count({
            where: { userId, isSaved: true, isDeleted: false }
        });

        // Get most used calculator
        const mostUsed = await prisma.calculation.groupBy({
            by: ['calculatorSlug', 'calculatorName', 'calculatorIcon'],
            where: { userId, isDeleted: false },
            _count: { calculatorSlug: true },
            orderBy: { _count: { calculatorSlug: 'desc' } },
            take: 1
        });

        // Get last calculation date
        const lastCalculation = await prisma.calculation.findFirst({
            where: { userId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
        });

        // Get recent calculations (last 5)
        const recentCalculations = await prisma.calculation.findMany({
            where: { userId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                calculatorSlug: true,
                calculatorName: true,
                calculatorIcon: true,
                inputs: true,
                outputs: true,
                isSaved: true,
                projectName: true,
                createdAt: true
            }
        });

        // Get favorite calculators
        const favorites = await prisma.favoriteCalculator.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 8
        });

        // Build response
        const dashboardData = {
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role?.name || 'User',
                lastLoginAt: user.lastLoginAt,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt
            },
            profile: user.profile || null,
            preferences: user.preferences || {
                unitSystem: 'metric',
                darkMode: false,
                compactView: false
            },
            stats: {
                totalCalculations,
                savedCalculations,
                mostUsedCalculator: mostUsed[0] ? {
                    name: mostUsed[0].calculatorName,
                    slug: mostUsed[0].calculatorSlug,
                    icon: mostUsed[0].calculatorIcon,
                    count: mostUsed[0]._count.calculatorSlug
                } : null,
                lastCalculationDate: lastCalculation?.createdAt || null
            },
            recentCalculations: recentCalculations.map(calc => ({
                ...calc,
                inputs: JSON.parse(calc.inputs || '{}'),
                outputs: JSON.parse(calc.outputs || '{}')
            })),
            favorites
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Failed to load dashboard' });
    }
};

/**
 * Get user profile
 */
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role?.name || 'User',
            isEmailVerified: user.isEmailVerified,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            profile: user.profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to get profile' });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, profession, designation, company, location, bio } = req.body;

        // Update user basic info
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                fullName: fullName || undefined,
                phone: phone || undefined
            }
        });

        // Upsert profile
        const profile = await prisma.userProfile.upsert({
            where: { userId },
            update: {
                profession: profession || undefined,
                designation: designation || undefined,
                company: company || undefined,
                location: location || undefined,
                bio: bio || undefined
            },
            create: {
                userId,
                profession,
                designation,
                company,
                location,
                bio
            }
        });

        // Log security event
        await logSecurityEvent({
            userId,
            action: SecurityActions.PROFILE_UPDATE,
            status: SecurityStatus.SUCCESS,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            details: 'Profile updated successfully'
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                fullName: updatedUser.fullName,
                phone: updatedUser.phone
            },
            profile
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

/**
 * Get user preferences
 */
export const getPreferences = async (req, res) => {
    try {
        const userId = req.user.id;

        let preferences = await prisma.userPreferences.findUnique({
            where: { userId }
        });

        // Return defaults if no preferences exist
        if (!preferences) {
            preferences = {
                unitSystem: 'metric',
                darkMode: false,
                compactView: false,
                emailNotifications: true,
                pushNotifications: false,
                language: 'en',
                defaultConcreteGrade: null,
                defaultSteelGrade: null,
                defaultCementType: null
            };
        }

        res.json(preferences);
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ message: 'Failed to get preferences' });
    }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            unitSystem,
            darkMode,
            compactView,
            emailNotifications,
            pushNotifications,
            language,
            defaultConcreteGrade,
            defaultSteelGrade,
            defaultCementType
        } = req.body;

        const preferences = await prisma.userPreferences.upsert({
            where: { userId },
            update: {
                unitSystem: unitSystem ?? undefined,
                darkMode: darkMode ?? undefined,
                compactView: compactView ?? undefined,
                emailNotifications: emailNotifications ?? undefined,
                pushNotifications: pushNotifications ?? undefined,
                language: language ?? undefined,
                defaultConcreteGrade: defaultConcreteGrade ?? undefined,
                defaultSteelGrade: defaultSteelGrade ?? undefined,
                defaultCementType: defaultCementType ?? undefined
            },
            create: {
                userId,
                unitSystem: unitSystem || 'metric',
                darkMode: darkMode || false,
                compactView: compactView || false,
                emailNotifications: emailNotifications !== false,
                pushNotifications: pushNotifications || false,
                language: language || 'en',
                defaultConcreteGrade,
                defaultSteelGrade,
                defaultCementType
            }
        });

        // Log security event
        await logSecurityEvent({
            userId,
            action: SecurityActions.SETTINGS_UPDATE,
            status: SecurityStatus.SUCCESS,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            details: 'Preferences updated'
        });

        res.json({
            message: 'Preferences updated successfully',
            preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ message: 'Failed to update preferences' });
    }
};

/**
 * Get login history
 */
export const getLoginHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            prisma.loginHistory.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.loginHistory.count({ where: { userId } })
        ]);

        res.json({
            history,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get login history error:', error);
        res.status(500).json({ message: 'Failed to get login history' });
    }
};
