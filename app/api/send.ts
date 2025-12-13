import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message, company } = request.body;

    // TODO: Update the 'to' email to your actual email address
    // TODO: Verify your domain in Resend to use a custom 'from' address
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["delivered@resend.dev"], // Replace with your email
      subject: `New Contact from Portfolio: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Contact Message</h2>
          <p>You received a new message from your portfolio contact form.</p>
          <hr />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return response.status(400).json({ error });
    }

    return response
      .status(200)
      .json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("Server error:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
