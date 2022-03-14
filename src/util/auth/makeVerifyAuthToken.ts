import { InvalidAuthTokenError } from '../../../../server/error/InvalidAuthTokenError'
import { UserDB } from '../../server/db'
import { KVStore } from '../../server/kv'

export async function makeVerifyAuthToken<U>(
  authToken: string | undefined,
  connectKV: () => Promise<{ authTokenKVStore: KVStore<string> }>,
  connectDB: () => Promise<{ userDB: UserDB<U> }>
): Promise<any> {
  if (authToken) {
    const kv = await connectKV()
    const db = await connectDB()

    const { authTokenKVStore } = kv
    const { userDB } = db

    const userId = await authTokenKVStore.get(authToken)

    if (userId) {
      const user = await userDB.get(userId)

      return user
    } else {
      throw new InvalidAuthTokenError()
    }
  } else {
    throw new InvalidAuthTokenError()
  }
}
