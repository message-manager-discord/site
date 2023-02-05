// disable by throwing an reditect to /

import { redirect } from "@remix-run/cloudflare";

async function disable() {
  throw redirect("/");
}

export { disable };
