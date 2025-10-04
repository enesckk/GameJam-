const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function testMembers() {
  try {
    // Test members data
    const testMembers = [
      {
        name: "Üye 1",
        email: "uye1@example.com",
        phone: "1234567891",
        age: 24,
        role: "designer"
      },
      {
        name: "Üye 2", 
        email: "uye2@example.com",
        phone: "1234567892",
        age: 23,
        role: "audio"
      }
    ];

    // Create test application
    const app = await db.application.create({
      data: {
        name: "Test Lider",
        email: "test@example.com",
        role: "developer",
        phone: "1234567890",
        age: 25,
        consentKVKK: true,
        type: "team",
        teamName: "Test Takımı",
        members: JSON.stringify(testMembers),
        status: "pending"
      }
    });

    console.log('Test başvurusu oluşturuldu:', app.id);
    console.log('Members:', app.members);

    // Parse and display
    if (app.members) {
      const parsed = JSON.parse(app.members);
      console.log('Parsed members:', JSON.stringify(parsed, null, 2));
    }

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await db.$disconnect();
  }
}

testMembers();
