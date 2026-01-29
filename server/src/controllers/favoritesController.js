import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/**
 * Get all favorite calculators for user
 */
export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await prisma.favoriteCalculator.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ favorites });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ message: 'Failed to get favorites' });
    }
};

/**
 * Add calculator to favorites
 */
export const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { calculatorSlug, calculatorName, calculatorIcon, category } = req.body;

        if (!calculatorSlug || !calculatorName) {
            return res.status(400).json({
                message: 'Calculator slug and name are required'
            });
        }

        // Check if already favorited
        const existing = await prisma.favoriteCalculator.findUnique({
            where: { userId_calculatorSlug: { userId, calculatorSlug } }
        });

        if (existing) {
            return res.status(400).json({ message: 'Calculator already in favorites' });
        }

        const favorite = await prisma.favoriteCalculator.create({
            data: {
                userId,
                calculatorSlug,
                calculatorName,
                calculatorIcon: calculatorIcon || 'fa-calculator',
                category: category || null
            }
        });

        res.status(201).json({
            message: 'Added to favorites',
            favorite
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ message: 'Failed to add favorite' });
    }
};

/**
 * Remove calculator from favorites
 */
export const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const calculatorSlug = req.params.slug;

        const existing = await prisma.favoriteCalculator.findUnique({
            where: { userId_calculatorSlug: { userId, calculatorSlug } }
        });

        if (!existing) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        await prisma.favoriteCalculator.delete({
            where: { userId_calculatorSlug: { userId, calculatorSlug } }
        });

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ message: 'Failed to remove favorite' });
    }
};

/**
 * Check if calculator is favorited
 */
export const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const calculatorSlug = req.params.slug;

        const favorite = await prisma.favoriteCalculator.findUnique({
            where: { userId_calculatorSlug: { userId, calculatorSlug } }
        });

        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ message: 'Failed to check favorite' });
    }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { calculatorSlug, calculatorName, calculatorIcon, category } = req.body;

        if (!calculatorSlug || !calculatorName) {
            return res.status(400).json({
                message: 'Calculator slug and name are required'
            });
        }

        const existing = await prisma.favoriteCalculator.findUnique({
            where: { userId_calculatorSlug: { userId, calculatorSlug } }
        });

        if (existing) {
            // Remove from favorites
            await prisma.favoriteCalculator.delete({
                where: { userId_calculatorSlug: { userId, calculatorSlug } }
            });
            res.json({ isFavorite: false, message: 'Removed from favorites' });
        } else {
            // Add to favorites
            await prisma.favoriteCalculator.create({
                data: {
                    userId,
                    calculatorSlug,
                    calculatorName,
                    calculatorIcon: calculatorIcon || 'fa-calculator',
                    category: category || null
                }
            });
            res.json({ isFavorite: true, message: 'Added to favorites' });
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ message: 'Failed to toggle favorite' });
    }
};
