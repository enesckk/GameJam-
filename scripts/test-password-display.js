const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function testPasswordDisplay() {
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
    console.log('Status:', testApp.status);
    console.log('Leader Password:', testApp.leaderPassword);
    console.log('Member Passwords:', testApp.memberPasswords);

    if (testApp.memberPasswords) {
      try {
        const parsed = JSON.parse(testApp.memberPasswords);
        console.log('Parsed member passwords:');
        parsed.forEach((member, i) => {
          console.log(`  ${i+1}. ${member.name} (${member.email}) - Şifre: ${member.password}`);
        });
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    }

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await db.$disconnect();
  }
}

testPasswordDisplay();
