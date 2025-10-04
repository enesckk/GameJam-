const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function updateTestPasswords() {
  try {
    // Test başvurusunu bul
    const testApp = await db.application.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testApp) {
      console.log('Test başvurusu bulunamadı');
      return;
    }

    // Lider şifresi ekle
    await db.application.update({
      where: { id: testApp.id },
      data: { leaderPassword: 'test123' },
    });

    // Üye şifreleri ekle
    const memberPasswords = [
      { email: 'uye1@example.com', name: 'Üye 1', password: 'uye1pass' },
      { email: 'uye2@example.com', name: 'Üye 2', password: 'uye2pass' }
    ];

    await db.application.update({
      where: { id: testApp.id },
      data: { memberPasswords: JSON.stringify(memberPasswords) },
    });

    console.log('✅ Şifreler güncellendi');

    // Sonucu kontrol et
    const updatedApp = await db.application.findUnique({
      where: { id: testApp.id }
    });

    console.log('Leader Password:', updatedApp.leaderPassword);
    console.log('Member Passwords:', updatedApp.memberPasswords);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await db.$disconnect();
  }
}

updateTestPasswords();
