import { redirect } from "next/navigation";

export default function AboutRedirect() {
  redirect("/privacy-policy?page=about");
}
