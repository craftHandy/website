import { redirect } from "next/navigation";

/** Legacy route kept for existing bookmarks. */
export default function OrdersRedirect() {
  redirect("/my-orders");
}
