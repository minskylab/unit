import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  unit: number
  opt: number
}

export interface O {
  URL: number
}

export default class Add extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['unit', 'opt'],
        o: ['URL'],
      },
      {},
      system,
      pod
    )
  }

  f({ unit, opt}: I, done: Done<O>): void {
    done({ 'URL': unit + opt })
  }
}
