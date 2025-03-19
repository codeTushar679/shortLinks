import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongo";
import { dataLink } from "../../models/link";
import { nanoid } from "nanoid";


export async function POST(req) {
  try {
    const payload = await req.json();
    await connectDB();

    // use provided or generate new 
    const finalShortLink = payload.shortLink?.trim() || nanoid(5);

    // check data already exist or not
    const existData = await dataLink.findOne({ shortLink: finalShortLink });
    if (existData) {
      return NextResponse.json({
        message: "Data already exist",
        success: false,
      });
    }

    const send = new dataLink(payload);
    const result = await send.save();

    return NextResponse.json({
      result,
      success: true,
      shortLink: finalShortLink
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
