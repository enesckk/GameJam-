const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkApplications() {
  try {
    const apps = await db.application.findMany({
      where: { type: 'team' },
      select: { id: true, name: true, teamName: true, members: true }
    });
    
    console.log('Takım başvuruları:');
    apps.forEach(app => {
      console.log(`- ${app.teamName} (Lider: ${app.name})`);
      console.log(`  Members: ${app.members || 'YOK'}`);
      if (app.members) {
        try {
          const parsed = JSON.parse(app.members);
          console.log(`  Parsed: ${JSON.stringify(parsed, null, 2)}`);
        } catch (e) {
          console.log(`  Parse error: ${e.message}`);
        }
      }
    });
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await db.$disconnect();
  }
}

checkApplications();
