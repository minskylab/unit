import { Dict } from '../../types/Dict'
import { UserSpec } from '../model/UserSpec'
import { FSCloudDB, FSSharedDB, FSUserDB } from './filesystem'

export async function connectDB(): Promise<UnitDB> {
  return {
    // userDB: memoryUserDB,
    // cloudDB: memoryCloudDB,
    // sharedDB: memorySharedDB,
    userDB: FSUserDB,
    cloudDB: FSCloudDB,
    sharedDB: FSSharedDB,
  }
}

export type UnitDB = {
  userDB: UserDB<UserSpec>
  cloudDB: CloudDB
  sharedDB: SharedDB
}

export type UserStore<T> = {
  create: (userId: string, id: string, entry: T) => Promise<T>
  get: (userId: string, id: string) => Promise<T>
  getAll: (userId: string) => Promise<T[]>
  put: (userId: string, id: string, entry: T) => Promise<T>
  delete: (userId: string, id: string) => Promise<void>
}

export type EntrySpec<T> = T

export type SharedEntrySpec = {
  userId: string
  entryId: string
}

export type CloudDB = Dict<UserStore<EntrySpec<any>>>
export type SharedDB = Dict<UserStore<SharedEntrySpec>>

export type UserDB<T> = {
  create: (user: T) => Promise<T>
  patch: (pbKey: string, partial: Partial<T>) => Promise<T>
  get(pbKey: string): Promise<T | null>
}
