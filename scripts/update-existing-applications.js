// scripts/update-existing-applications.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateExistingApplications() {
  try {
    console.log('Mevcut başvuruları güncelleniyor...');
    
    // Tüm mevcut başvuruları "pending" olarak güncelle
    const result = await prisma.application.updateMany({
      where: {
        status: undefined, // status alanı olmayan kayıtlar
      },
      data: {
        status: 'pending',
      },
    });
    
    console.log(`${result.count} başvuru "pending" olarak güncellendi.`);
    
    // Tüm başvuruları listele
    const applications = await prisma.application.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log('\nMevcut başvurular:');
    applications.forEach(app => {
      console.log(`- ${app.name} (${app.email}) - ${app.status || 'undefined'}`);
    });
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingApplications();
