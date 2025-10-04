// scripts/test-admin-api.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminAPI() {
  try {
    console.log('Admin API test ediliyor...');
    
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`Toplam başvuru: ${applications.length}`);
    
    const mapped = applications.map(app => ({
      id: app.id,
      name: app.name,
      email: app.email,
      role: app.role,
      phone: app.phone,
      age: app.age,
      type: app.type,
      teamName: app.teamName,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
      approvedAt: app.approvedAt?.toISOString(),
      rejectedAt: app.rejectedAt?.toISOString(),
    }));
    
    console.log('Mapped applications:', mapped.length);
    console.log('İlk 3 başvuru:');
    mapped.slice(0, 3).forEach(app => {
      console.log(`- ${app.name} (${app.email}) - ${app.status}`);
    });
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAPI();
