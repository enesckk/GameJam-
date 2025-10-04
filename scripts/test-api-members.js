// Built-in fetch kullanıyoruz

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/applications');
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.applications) {
      const testApp = data.applications.find(app => app.email === 'test@example.com');
      if (testApp) {
        console.log('\nTest başvurusu bulundu:');
        console.log('Name:', testApp.name);
        console.log('Team Name:', testApp.teamName);
        console.log('Members:', testApp.members);
        console.log('Members type:', typeof testApp.members);
        if (testApp.members) {
          console.log('Members length:', testApp.members.length);
          testApp.members.forEach((member, i) => {
            console.log(`  Üye ${i+1}:`, member.name, member.email);
          });
        }
      }
    }
  } catch (error) {
    console.error('Hata:', error);
  }
}

testAPI();
