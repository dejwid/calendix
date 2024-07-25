import {nylas, nylasConfig} from "@/libs/nylas";
import {redirect} from "next/navigation";

export async function GET() {
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
  });
  return redirect(authUrl);
}