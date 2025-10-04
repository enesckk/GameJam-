const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function testTeamApproval() {
  try {
    // Test başvurusunu bul
    const testApp = await db.application.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testApp) {
      console.log('Test başvurusu bulunamadı');
      return;
    }

    console.log('Test başvurusu bulundu:', testApp.teamName);
    console.log('Members:', testApp.members);

    // Members'ı parse et
    if (testApp.members) {
      const members = JSON.parse(testApp.members);
      console.log('Parsed members:', members.length, 'kişi');
      members.forEach((member, i) => {
        console.log(`  ${i+1}. ${member.name} (${member.email})`);
      });
    }

    // Şu anki kullanıcıları kontrol et
    const users = await db.user.findMany({
      where: { email: { in: ['test@example.com', 'uye1@example.com', 'uye2@example.com'] } }
    });

    console.log('\nMevcut kullanıcılar:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Team: ${user.teamId || 'YOK'}`);
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await db.$disconnect();
  }
}

testTeamApproval();
