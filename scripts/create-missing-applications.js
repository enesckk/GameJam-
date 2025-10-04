// scripts/create-missing-applications.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createMissingApplications() {
  try {
    console.log('Eksik başvuruları oluşturuyor...');
    
    // Tüm kullanıcıları al
    const users = await prisma.user.findMany({
      where: { role: 'PARTICIPANT' },
      select: { id: true, name: true, email: true, phone: true, age: true, profileRole: true }
    });
    
    // Mevcut başvuruları al
    const existingApplications = await prisma.application.findMany({
      select: { email: true }
    });
    
    const existingEmails = new Set(existingApplications.map(app => app.email));
    
    // Eksik başvuruları oluştur
    const missingUsers = users.filter(user => !existingEmails.has(user.email));
    
    console.log(`${missingUsers.length} kullanıcı için başvuru oluşturulacak...`);
    
    for (const user of missingUsers) {
      await prisma.application.create({
        data: {
          name: user.name,
          email: user.email,
          role: user.profileRole || 'developer',
          phone: user.phone || '',
          age: user.age || 18,
          type: 'team', // Varsayılan olarak takım başvurusu
          teamName: 'Takım',
          consentKVKK: true,
          status: 'approved', // Mevcut kullanıcılar zaten onaylanmış sayılır
          approvedAt: new Date(),
        }
      });
      
      console.log(`✓ ${user.name} (${user.email}) için başvuru oluşturuldu`);
    }
    
    // Sonuçları kontrol et
    const totalApplications = await prisma.application.count();
    console.log(`\nToplam başvuru sayısı: ${totalApplications}`);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingApplications();
