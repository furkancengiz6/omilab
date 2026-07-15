import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

export async function POST(req) {
  try {
    const { planId, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Kullanıcı girişi gerekli" }, { status: 401 });
    }

    // Sahte checkout session oluştur (Çünkü Stripe API key henüz test keyi)
    // Gerçek uygulamada stripe.checkout.sessions.create kullanılır.
    
    // Prototip için sadece başarılı olma linkini gönderiyoruz
    const mockUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`;

    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Ödeme altyapısına bağlanılamadı." }, { status: 500 });
  }
}
