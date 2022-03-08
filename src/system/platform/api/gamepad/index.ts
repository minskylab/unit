import { Functional, FunctionalEvents } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I {
  i: number
}

export interface O {}

type GamePad_EE = {}

export type GamepadEvents = FunctionalEvents<GamePad_EE> & GamePad_EE

export default class GamePad extends Functional<I, O, GamepadEvents> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['i'],
        o: [],
      },
      { 

      },
      system,
      pod
    )
  }

  async f({ i }, done: Done<O>): Promise<void> {
    done({})
  }

  d() {}
}
