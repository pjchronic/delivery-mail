import { PackageDeliveryInterface } from "@/app/interfaces/interfaces";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import TemplateConvert from "@/app/components/TemplateConvert";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const packageDelivery: PackageDeliveryInterface = await request.json();
  const to: string[] = packageDelivery.destinatario.split(";");


  const template = <TemplateConvert htmlText={packageDelivery.template}/>;

  try {
    const { data, error } = await resend.emails.send({
      from: "paulojunior@pj.dev.br",
      to: to,
      subject: packageDelivery.assunto,
      react: template,
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
