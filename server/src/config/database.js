import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize default roles
async function initializeRoles() {
    const roles = [
        { name: 'admin', description: 'Full system access' },
        { name: 'user', description: 'Standard user access' },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }
    console.log('✅ Default roles initialized');
}

// Connect and initialize
prisma.$connect()
    .then(() => {
        console.log('✅ Database connected');
        return initializeRoles();
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    });

export default prisma;
