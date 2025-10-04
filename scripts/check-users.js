// scripts/check-users.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    console.log('Mevcut kullanıcılar:', users.length);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) - ${u.role}`));
    
    const applications = await prisma.application.findMany({
      select: { id: true, name: true, email: true, status: true }
    });
    console.log('\nMevcut başvurular:', applications.length);
    applications.forEach(a => console.log(`- ${a.name} (${a.email}) - ${a.status}`));
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
