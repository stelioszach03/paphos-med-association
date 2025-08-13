import { PKPass } from 'passkit-generator'

export type AppleResult =
  | { ok: false; reason: string }
  | { ok: true; buffer: Buffer }

export async function issueApplePass(): Promise<AppleResult> {
  const {
    APPLE_TEAM_ID,
    APPLE_KEY_ID,
    APPLE_P8_KEY,
    APPLE_PASS_TYPE_ID,
    APPLE_CERT_PASSWORD,
  } = process.env
  if (
    !APPLE_TEAM_ID ||
    !APPLE_KEY_ID ||
    !APPLE_P8_KEY ||
    !APPLE_PASS_TYPE_ID ||
    !APPLE_CERT_PASSWORD
  ) {
    return { ok: false, reason: 'missing-config' }
  }

  // Minimal pass generation; assumes certificates are valid in env
  const pass = new PKPass(
    {
      model: {},
      certificates: {
        signerKey: {
          key: APPLE_P8_KEY,
          passphrase: APPLE_CERT_PASSWORD,
        },
      },
    } as any
  )

  // Basic fields
  // @ts-ignore
  pass.headerFields.add({ key: 'org', value: 'PMA' })

  const buffer = await pass.getAsBuffer()
  return { ok: true, buffer }
}
