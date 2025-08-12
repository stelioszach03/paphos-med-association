export type ApplePassArgs = { userId: string; fullName: string; registryNo: string }

export async function issueApplePass(args: ApplePassArgs) {
  const { APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_P8_KEY, APPLE_PASS_TYPE_ID, APPLE_CERT_PASSWORD } = process.env
  if (!APPLE_TEAM_ID || !APPLE_KEY_ID || !APPLE_P8_KEY || !APPLE_PASS_TYPE_ID || !APPLE_CERT_PASSWORD) {
    return { ok: false, reason: 'missing-config' as const }
  }
  // Real implementation would sign and return .pkpass
  return { ok: true as const, urlOrBuffer: `apple-pass-${args.userId}` }
}
