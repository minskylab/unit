import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../method/process/BundleSpec'

export interface I {
  W: any
  A: BundleSpec
  E: number[]
  I: number[]
}

export interface O {
  O: number[]
}

export default class InputLayer extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['I'],
        o: [],
      },
      {
        input: {
          I: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      pod
    )
  }

  async f({}: I, done: Done<O>): Promise<void> {
    done({})
  }
}
