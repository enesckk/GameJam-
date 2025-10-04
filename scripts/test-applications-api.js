// scripts/test-applications-api.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testApplicationsAPI() {
  try {
    console.log('Applications API test ediliyor...');
    
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`Toplam başvuru: ${applications.length}`);
    
    applications.forEach(app => {
      console.log(`- ${app.name} (${app.email}) - ${app.status}`);
    });
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApplicationsAPI();
