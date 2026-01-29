import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

/**
 * Get all calculations with pagination and filters
 */
export const getCalculations = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filters
        const calculatorType = req.query.type || undefined;
        const isSaved = req.query.saved === 'true' ? true : undefined;
        const projectName = req.query.project || undefined;
        const search = req.query.search || '';

        const where = {
            userId,
            isDeleted: false,
            ...(calculatorType && { calculatorSlug: calculatorType }),
            ...(isSaved !== undefined && { isSaved }),
            ...(projectName && { projectName }),
            ...(search && {
                OR: [
                    { calculatorName: { contains: search } },
                    { projectName: { contains: search } },
                    { notes: { contains: search } }
                ]
            })
        };

        const [calculations, total] = await Promise.all([
            prisma.calculation.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.calculation.count({ where })
        ]);

        // Parse JSON fields
        const parsed = calculations.map(calc => ({
            ...calc,
            inputs: JSON.parse(calc.inputs || '{}'),
            outputs: JSON.parse(calc.outputs || '{}')
        }));

        res.json({
            calculations: parsed,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get calculations error:', error);
        res.status(500).json({ message: 'Failed to get calculations' });
    }
};

/**
 * Get single calculation by ID
 */
export const getCalculation = async (req, res) => {
    try {
        const userId = req.user.id;
        const calcId = parseInt(req.params.id);

        const calculation = await prisma.calculation.findFirst({
            where: { id: calcId, userId, isDeleted: false }
        });

        if (!calculation) {
            return res.status(404).json({ message: 'Calculation not found' });
        }

        res.json({
            ...calculation,
            inputs: JSON.parse(calculation.inputs || '{}'),
            outputs: JSON.parse(calculation.outputs || '{}')
        });
    } catch (error) {
        console.error('Get calculation error:', error);
        res.status(500).json({ message: 'Failed to get calculation' });
    }
};

/**
 * Save a new calculation
 */
export const saveCalculation = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            calculatorSlug,
            calculatorName,
            calculatorIcon,
            inputs,
            outputs,
            isSaved,
            projectName,
            notes
        } = req.body;

        // Validate required fields
        if (!calculatorSlug || !calculatorName || !inputs || !outputs) {
            return res.status(400).json({
                message: 'Calculator slug, name, inputs, and outputs are required'
            });
        }

        const calculation = await prisma.calculation.create({
            data: {
                userId,
                calculatorSlug,
                calculatorName,
                calculatorIcon: calculatorIcon || 'fa-calculator',
                inputs: JSON.stringify(inputs),
                outputs: JSON.stringify(outputs),
                isSaved: isSaved || false,
                projectName: projectName || null,
                notes: notes || null
            }
        });

        res.status(201).json({
            message: 'Calculation saved successfully',
            calculation: {
                ...calculation,
                inputs: JSON.parse(calculation.inputs),
                outputs: JSON.parse(calculation.outputs)
            }
        });
    } catch (error) {
        console.error('Save calculation error:', error);
        res.status(500).json({ message: 'Failed to save calculation' });
    }
};

/**
 * Update a calculation (notes, project, saved status)
 */
export const updateCalculation = async (req, res) => {
    try {
        const userId = req.user.id;
        const calcId = parseInt(req.params.id);
        const { isSaved, projectName, notes } = req.body;

        // Check ownership
        const existing = await prisma.calculation.findFirst({
            where: { id: calcId, userId, isDeleted: false }
        });

        if (!existing) {
            return res.status(404).json({ message: 'Calculation not found' });
        }

        const updated = await prisma.calculation.update({
            where: { id: calcId },
            data: {
                isSaved: isSaved ?? existing.isSaved,
                projectName: projectName !== undefined ? projectName : existing.projectName,
                notes: notes !== undefined ? notes : existing.notes
            }
        });

        res.json({
            message: 'Calculation updated successfully',
            calculation: {
                ...updated,
                inputs: JSON.parse(updated.inputs),
                outputs: JSON.parse(updated.outputs)
            }
        });
    } catch (error) {
        console.error('Update calculation error:', error);
        res.status(500).json({ message: 'Failed to update calculation' });
    }
};

/**
 * Delete a calculation (soft delete)
 */
export const deleteCalculation = async (req, res) => {
    try {
        const userId = req.user.id;
        const calcId = parseInt(req.params.id);

        // Check ownership
        const existing = await prisma.calculation.findFirst({
            where: { id: calcId, userId, isDeleted: false }
        });

        if (!existing) {
            return res.status(404).json({ message: 'Calculation not found' });
        }

        await prisma.calculation.update({
            where: { id: calcId },
            data: { isDeleted: true }
        });

        res.json({ message: 'Calculation deleted successfully' });
    } catch (error) {
        console.error('Delete calculation error:', error);
        res.status(500).json({ message: 'Failed to delete calculation' });
    }
};

/**
 * Get calculation statistics
 */
export const getCalculationStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Total calculations
        const total = await prisma.calculation.count({
            where: { userId, isDeleted: false }
        });

        // Saved calculations
        const saved = await prisma.calculation.count({
            where: { userId, isSaved: true, isDeleted: false }
        });

        // By calculator type
        const byType = await prisma.calculation.groupBy({
            by: ['calculatorSlug', 'calculatorName', 'calculatorIcon'],
            where: { userId, isDeleted: false },
            _count: { calculatorSlug: true },
            orderBy: { _count: { calculatorSlug: 'desc' } },
            take: 10
        });

        // By project
        const byProject = await prisma.calculation.groupBy({
            by: ['projectName'],
            where: { userId, isDeleted: false, projectName: { not: null } },
            _count: { projectName: true },
            orderBy: { _count: { projectName: 'desc' } }
        });

        // This month count
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonth = await prisma.calculation.count({
            where: {
                userId,
                isDeleted: false,
                createdAt: { gte: startOfMonth }
            }
        });

        res.json({
            total,
            saved,
            thisMonth,
            byType: byType.map(t => ({
                slug: t.calculatorSlug,
                name: t.calculatorName,
                icon: t.calculatorIcon,
                count: t._count.calculatorSlug
            })),
            byProject: byProject.map(p => ({
                name: p.projectName,
                count: p._count.projectName
            }))
        });
    } catch (error) {
        console.error('Get calculation stats error:', error);
        res.status(500).json({ message: 'Failed to get statistics' });
    }
};
