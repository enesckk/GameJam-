// scripts/check-teams.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTeams() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          select: { name: true, email: true, role: true }
        }
      }
    });
    
    console.log('Mevcut takımlar:');
    teams.forEach(team => {
      console.log(`- ${team.name} (${team.members.length} üye)`);
      team.members.forEach(member => {
        console.log(`  - ${member.name} (${member.email}) - ${member.role}`);
      });
    });
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTeams();
