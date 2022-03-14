import { randomUUID, verify } from 'crypto'
import * as http from 'http'
import * as WebSocket from 'ws'
import { EventEmitter } from '../../EventEmitter'
import { NOOP } from '../../NOOP'
import { Dict } from '../../types/Dict'
import { uuidNotIn } from '../../util/id'
import { InvalidMessageError } from '../error/InvalidMessageError'
import { InvalidMessageTypeError } from '../error/InvalidMessageTypeError'
import { Req } from '../req'
import { WSS_PING_T } from './constant'

const wss_user_session_socket: Dict<Dict<Dict<WebSocket>>> = {}
const wss_user_session_count: Dict<number> = {}
const wss_user_socket_count: Dict<number> = {}
const wss_user_session_socket_alive: Dict<Dict<Dict<boolean>>> = {}
const wss_user_session_socket_count: Dict<Dict<number>> = {}
let wss_socket_count: number = 0

export interface NotAuthPeer {
  userId: null
  sessionId: null
  socketId: string
}

export interface AuthPeer {
  userId: string
  sessionId: string
  socketId: string
}

export function wsId(peer: AuthPeer): string {
  const { userId, sessionId, socketId } = peer
  return `${userId}/${sessionId}/${socketId}`
}

export function getUserWSConnection(userId: string): Dict<Dict<WebSocket>> {
  return wss_user_session_socket[userId]
}

export function getWS(
  userId: string,
  sessionId: string,
  socketId: string
): WebSocket {
  return wss_user_session_socket[userId][sessionId][socketId]
}

export function send(ws: WebSocket, data: any): void {
  const message = JSON.stringify(data)
  ws.send(message)
}

export function userBroadcast(
  userId: string,
  sessionId: string,
  data: any
): void {
  const user_session_ws = wss_user_session_socket[userId] || {}
  for (const _sessionId in user_session_ws) {
    if (_sessionId !== sessionId) {
      const session_ws = user_session_ws[_sessionId]
      for (const _socketId in session_ws) {
        const ws = session_ws[_socketId]
        send(ws, data)
      }
    }
  }
}

function removeUserSessionSocket(
  userId: string,
  sessionId: string,
  socketId: string
): void {
  delete wss_user_session_socket[userId][sessionId][socketId]
  delete wss_user_session_socket_alive[userId][sessionId][socketId]
  wss_user_session_socket_count[userId][sessionId]--
  if (wss_user_session_socket_count[userId][sessionId] === 0) {
    delete wss_user_session_socket[userId][sessionId]
    delete wss_user_session_socket_count[userId][sessionId]
    delete wss_user_session_socket_alive[userId][sessionId]
    wss_user_session_count[userId]--
    if (wss_user_session_count[userId] === 0) {
      delete wss_user_session_count[userId]
    }
  }
  wss_user_socket_count[userId]--
  if (wss_user_socket_count[userId] === 0) {
    delete wss_user_socket_count[userId]
    delete wss_user_session_socket[userId]
    delete wss_user_session_socket_alive[userId]
  }
  wss_socket_count--
  console.log('wss_connection_count', wss_socket_count)
}

export const emitter = new EventEmitter()

export * from './server'

export function start(server: http.Server) {
  server.on('upgrade', async function upgrade(req: Req, socket, head) {
    function refuse() {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }

    try {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req)
      })
    } catch {
      refuse()
      return
    }
  })

  const wss = new WebSocket.Server({ noServer: true, path: '/' })

  wss.on('connection', function connection(ws, req: Req) {
    const { user, sessionId } = req

    const { userId } = user

    wss_user_session_socket[userId] = wss_user_session_socket[userId] || {}
    wss_user_session_socket_alive[userId] =
      wss_user_session_socket_alive[userId] || {}

    if (wss_user_session_socket[userId][sessionId] === undefined) {
      wss_user_session_socket[userId][sessionId] =
        wss_user_session_socket[userId][sessionId] || {}
      wss_user_session_socket_alive[userId][sessionId] =
        wss_user_session_socket_alive[userId][sessionId] || {}
      wss_user_session_count[userId] = wss_user_session_count[userId] || 0
      wss_user_session_count[userId]++
      // console.log(
      //   'wss_user_session_socket[userId][sessionId]',
      //   wss_user_session_socket[userId][sessionId]
      // )
    }

    const socketId = uuidNotIn(wss_user_session_socket[userId][sessionId])

    wss_user_session_socket[userId][sessionId][socketId] = ws
    wss_user_session_socket_alive[userId][sessionId][socketId] = true

    wss_user_session_socket_count[userId] =
      wss_user_session_socket_count[userId] || {}

    wss_user_session_socket_count[userId][sessionId] =
      wss_user_session_socket_count[userId][sessionId] || 0
    wss_user_session_socket_count[userId][sessionId]++

    // console.log(
    //   'wss_user_session_socket_count[userId][sessionId]',
    //   wss_user_session_socket_count[userId][sessionId]
    // )

    wss_user_socket_count[userId] = wss_user_socket_count[userId] || 0
    wss_user_socket_count[userId]++

    // console.log('wss_user_socket_count[userId]', wss_user_socket_count[userId])

    wss_socket_count++

    // console.log('wss_socket_count', wss_socket_count)

    const secret = randomUUID()

    let peer: NotAuthPeer | AuthPeer = {
      userId: null,
      sessionId: null,
      socketId,
    }

    function handleAuth(action) {
      const { userId, sessionId, signedSecret } = action

      if (typeof userId !== 'string' || typeof signedSecret !== 'string') {
        throw new Error('Invalid auth data')
      }

      const _secret = Buffer.from(secret)
      const _signedSecret = Buffer.from(signedSecret)

      const valid = verify('SHA256', _secret, userId, _signedSecret)

      if (valid) {
        peer.userId = userId
        peer.sessionId = sessionId
      }
    }

    async function handleAction(action): Promise<void> {
      const { type, data } = action

      emitter.emit(type, data, peer, ws)
    }

    ws.on('message', async function incoming(message) {
      const data_str = message.toString()

      try {
        let _data

        try {
          _data = JSON.parse(data_str)
        } catch (err) {
          throw new InvalidMessageError()
        }

        if (typeof _data !== 'object' || _data === null) {
          throw new InvalidMessageError()
        }

        const { type, data } = _data

        switch (type) {
          case 'auth': {
            handleAuth(data)

            break
          }
          case 'action': {
            handleAction(data)

            break
          }
          default: {
            throw new InvalidMessageTypeError()
          }
        }
      } catch (err) {
        ws.close()
      }
    })

    ws.on('pong', () => {
      wss_user_session_socket_alive[userId][sessionId][socketId] = true
    })

    ws.on('close', () => {
      removeUserSessionSocket(userId, sessionId, socketId)
    })
  })

  const ping_interval = setInterval(function ping() {
    for (const userId in wss_user_session_socket_alive) {
      const session_socket = wss_user_session_socket[userId]
      const session_socket_alive = wss_user_session_socket_alive[userId]
      for (const sessionId in session_socket_alive) {
        const socket_alive = session_socket_alive[sessionId]
        const socket = session_socket[sessionId]
        for (const socketId in socket_alive) {
          const alive: boolean = socket_alive[socketId]
          const ws: WebSocket = socket[socketId]
          if (alive) {
            socket_alive[socketId] = false
            ws.ping(NOOP)
          } else {
            ws.terminate()
          }
        }
      }
    }
  }, WSS_PING_T)

  wss.on('close', function close() {
    console.log('wss', 'close')
    clearInterval(ping_interval)
  })
}

export function isValidSignedSecret(
  userId: string,
  secret: string,
  signedSecret: string
): boolean {
  // TODO
  return true
}
