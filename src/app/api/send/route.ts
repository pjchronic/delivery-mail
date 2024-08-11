import { PackageDeliveryInterface } from "@/app/interfaces/interfaces";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const packageDelivery: PackageDeliveryInterface = await request.json();

  const to: string[] = packageDelivery.destinatario.split(";");

  try {
    const { data, error } = await resend.emails.send({
      from: "pidjey1306929@gmail.com",
      to: to,
      subject: packageDelivery.assunto,
      react: packageDelivery.template,
    });

    if (error) {
      throw new Error(error?.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
