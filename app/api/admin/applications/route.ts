// app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/use-user";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

// Şifre oluşturma fonksiyonu
function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.ok || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const applications = await db.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      applications: applications.map(app => ({
        id: app.id,
        name: app.name,
        email: app.email,
        role: app.role,
        phone: app.phone,
        age: app.age,
        type: app.type,
        teamName: app.teamName,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        approvedAt: app.approvedAt?.toISOString(),
        rejectedAt: app.rejectedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Başvurular yüklenirken hata:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session.ok || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Geçersiz parametreler" }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === "approved") {
      updateData.approvedAt = new Date();
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
    }

    const application = await db.application.update({
      where: { id },
      data: updateData,
    });

    // Eğer onaylandıysa, kullanıcı hesabı oluştur ve mail gönder
    if (status === "approved") {
      const existingUser = await db.user.findUnique({
        where: { email: application.email },
      });

      if (!existingUser) {
        // Şifre oluştur
        const plainPassword = generatePassword();
        const passwordHash = await bcrypt.hash(plainPassword, 12);

        // Yeni kullanıcı oluştur
        await db.user.create({
          data: {
            email: application.email,
            name: application.name,
            phone: application.phone || "",
            age: application.age || 18,
            role: "PARTICIPANT",
            profileRole: application.role,
            canLogin: true,
            passwordHash: passwordHash,
          },
        });

        // Onay maili gönder
        try {
          await sendEmail({
            to: application.email,
            subject: "Game Jam Başvurunuz Onaylandı! 🎉",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px;">🎮 Game Jam Başvurunuz Onaylandı!</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hoş geldiniz!</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                  <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                    Merhaba <strong>${application.name}</strong>,
                  </p>
                  
                  <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                    Game Jam başvurunuz başarıyla onaylandı! Artık sisteme giriş yapabilirsiniz.
                  </p>
                  
                  <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Giriş Bilgileriniz:</h3>
                    <p style="margin: 10px 0;"><strong>E-posta:</strong> ${application.email}</p>
                    <p style="margin: 10px 0;"><strong>Şifre:</strong> <code style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${plainPassword}</code></p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                      🚀 Sisteme Giriş Yap
                    </a>
                  </div>
                  
                  <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #1976d2; font-size: 14px;">
                      <strong>Önemli:</strong> Güvenliğiniz için lütfen ilk girişinizde şifrenizi değiştirin.
                    </p>
                  </div>
                  
                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    Sorularınız için bizimle iletişime geçebilirsiniz.<br>
                    İyi şanslar! 🎮
                  </p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Mail gönderilirken hata:", emailError);
          // Mail hatası olsa bile kullanıcı oluşturulmuş olur
        }
      }
    }

    return NextResponse.json({
      ok: true,
      application: {
        id: application.id,
        name: application.name,
        email: application.email,
        status: application.status,
        approvedAt: application.approvedAt?.toISOString(),
        rejectedAt: application.rejectedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Başvuru güncellenirken hata:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
