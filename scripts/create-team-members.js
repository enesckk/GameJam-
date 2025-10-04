const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

async function createTeamMembers() {
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
    
    // Team'i bul
    const team = await db.team.findFirst({
      where: { name: testApp.teamName }
    });

    if (!team) {
      console.log('Team bulunamadı');
      return;
    }

    console.log('Team bulundu:', team.id);

    // Members'ı parse et
    const members = JSON.parse(testApp.members);
    console.log('Members:', members.length, 'kişi');

    // Her üye için kullanıcı oluştur
    for (const member of members) {
      // Şifre oluştur
      const password = 'test123'; // Test şifresi
      const passwordHash = await bcrypt.hash(password, 12);

      // Kullanıcı oluştur
      const user = await db.user.create({
        data: {
          email: member.email,
          name: member.name,
          phone: member.phone || "",
          age: member.age || 18,
          role: "PARTICIPANT",
          profileRole: member.role,
          canLogin: true,
          passwordHash: passwordHash,
          teamId: team.id,
        },
      });

      console.log(`✅ Üye oluşturuldu: ${user.name} (${user.email})`);
    }

    // Sonuçları kontrol et
    const allUsers = await db.user.findMany({
      where: { teamId: team.id }
    });

    console.log(`\nTeam ${team.name} üyeleri (${allUsers.length} kişi):`);
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.profileRole}`);
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await db.$disconnect();
  }
}

createTeamMembers();
