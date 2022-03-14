import { connectDB } from '../../server/db'
import { connectKV } from '../../server/kv'
import { makeVerifyAuthToken } from './makeVerifyAuthToken'

export async function verifyAuthToken(
  authToken: string | undefined
): Promise<any> {
  return makeVerifyAuthToken(authToken, connectKV, connectDB)
}
