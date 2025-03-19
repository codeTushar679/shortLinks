import { redirect } from "next/navigation";
import { connectDB } from "../lib/mongo";
import { dataLink } from "../models/link";

export default async function Page({ params }) {
  await connectDB();
  const foundLink = await dataLink.findOne({ shortLink: params.shortLink });
  if (foundLink) {
    return redirect(foundLink.orgLink);
  } else {
    return redirect("/");
  }
}
