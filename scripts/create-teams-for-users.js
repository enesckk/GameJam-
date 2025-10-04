// scripts/create-teams-for-users.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTeamsForUsers() {
  try {
    console.log('Kullanıcılar için takımlar oluşturuluyor...');
    
    // Team'i olmayan PARTICIPANT'ları bul
    const usersWithoutTeam = await prisma.user.findMany({
      where: {
        role: 'PARTICIPANT',
        teamId: null
      },
      select: { id: true, name: true, email: true }
    });
    
    console.log(`${usersWithoutTeam.length} kullanıcı için takım oluşturulacak...`);
    
    for (const user of usersWithoutTeam) {
      // Her kullanıcı için ayrı takım oluştur
      const team = await prisma.team.create({
        data: {
          name: `${user.name} Takımı`,
        },
      });
      
      // Kullanıcıyı takıma bağla
      await prisma.user.update({
        where: { id: user.id },
        data: { teamId: team.id }
      });
      
      console.log(`✓ ${user.name} için takım oluşturuldu: ${team.name}`);
    }
    
    // Sonuçları kontrol et
    const totalTeams = await prisma.team.count();
    const usersWithTeams = await prisma.user.count({
      where: { role: 'PARTICIPANT', teamId: { not: null } }
    });
    
    console.log(`\nToplam takım sayısı: ${totalTeams}`);
    console.log(`Takımı olan kullanıcı sayısı: ${usersWithTeams}`);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTeamsForUsers();
