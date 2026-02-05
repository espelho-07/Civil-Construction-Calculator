/**
 * Prisma seed: Ensures default roles and creates/updates the Admin user.
 * Run: npm run db:seed (or npx prisma db seed)
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'adminnirniq26@gmail.com';
const ADMIN_PASSWORD = 'nirniQ##45^23DJ';
const ADMIN_FULL_NAME = 'Admin User';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

async function main() {
    // 1. Ensure default roles exist
    await prisma.role.upsert({
        where: { name: 'admin' },
        create: { name: 'admin', description: 'Full system access' },
        update: {},
    });
    await prisma.role.upsert({
        where: { name: 'user' },
        create: { name: 'user', description: 'Standard user access' },
        update: {},
    });

    const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
    if (!adminRole) throw new Error('Admin role not found after upsert');

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

    // 2. Create or update Admin user
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (existing) {
        await prisma.user.update({
            where: { id: existing.id },
            data: {
                fullName: ADMIN_FULL_NAME,
                passwordHash,
                roleId: adminRole.id,
                isActive: true,
                isEmailVerified: true,
                failedLoginCount: 0,
                lockedUntil: null,
            },
        });
        console.log('✅ Admin user updated:', ADMIN_EMAIL);
    } else {
        await prisma.user.create({
            data: {
                fullName: ADMIN_FULL_NAME,
                email: ADMIN_EMAIL,
                passwordHash,
                roleId: adminRole.id,
                isEmailVerified: true,
                isActive: true,
            },
        });
        console.log('✅ Admin user created:', ADMIN_EMAIL);
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
