// Test approval API
async function testApprovalAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/applications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'cmgcis1680000vri8259p7irg', // Test başvurusu ID'si
        status: 'approved'
      })
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (data.ok) {
      console.log('✅ Başvuru onaylandı');
    } else {
      console.log('❌ Hata:', data.message);
    }

  } catch (error) {
    console.error('❌ API Hatası:', error.message);
  }
}

testApprovalAPI();
