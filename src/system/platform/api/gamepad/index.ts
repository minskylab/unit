import { Functional, FunctionalEvents } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import callAll from '../../../../util/call/callAll'

export interface I {
  i: number
}

export interface O {}

type GamePad_EE = {}

export type GamepadEvents = FunctionalEvents<GamePad_EE> & GamePad_EE

export default class _Gamepad extends Functional<I, O, GamepadEvents> {
  private _gamepad: Gamepad

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['i'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  async f({ i }, done: Done<O>): Promise<void> {
    const {
      api: {
        clipboard: { writeText },
        input: {
          gamepad: { getGamepad, addEventListener },
        },
      },
    } = this.__system

    try {
      this._gamepad = getGamepad(i)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const onConnect = (event: GamepadEvent) => {
      const { gamepad } = event
      
      const { index } = gamepad

      if (index === i) {
        this._gamepad = gamepad
      }
    }

    const onDisconnect = (event: GamepadEvent) => {
      const { gamepad } = event
      const { index } = gamepad
    }

    const unlisten = callAll([
      addEventListener('gamepadconnected', onConnect),
      addEventListener('gamepadisconnected', onDisconnect),
    ])
  }

  d() {}
}
