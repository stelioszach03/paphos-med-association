import { GoogleAuth } from 'google-auth-library'
import jwt from 'jsonwebtoken'

export type GoogleResult =
  | { ok: false; reason: string }
  | { ok: true; link: string }

export async function issueGooglePass(userId: string): Promise<GoogleResult> {
  const creds = process.env.GOOGLE_WALLET_CREDENTIALS_JSON
  if (!creds) return { ok: false, reason: 'missing-config' }
  const credentials = JSON.parse(creds)
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  })
  await auth.getClient()
  const payload = {
    iss: credentials.client_email,
    aud: 'google',
    origins: ['*'],
    typ: 'savetowallet',
    payload: {
      genericObjects: [
        {
          id: `${credentials.project_id}.${userId}`,
          classId: `${credentials.project_id}.pma`,
        },
      ],
    },
  }
  const token = jwt.sign(payload, credentials.private_key, {
    algorithm: 'RS256',
  })
  const link = `https://pay.google.com/gp/v/save/${token}`
  return { ok: true, link }
}
