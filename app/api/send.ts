import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      message?: string;
      company?: string;
    };
    const { name, email, message, company } = body;

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Caos Domado <onboarding@resend.dev>', // Update with verified domain when available
      to: ['contato@caosdomado.com'],
      replyTo: email,
      subject: `Novo contato: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff7a1a;">Novo Contato do Portfólio</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company || 'N/A'}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensagem:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Server error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
