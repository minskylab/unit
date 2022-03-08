import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../method/process/BundleSpec'

export interface I {
  n: any
  L: BundleSpec
}

export interface O {
  W: number[]
}

export default class RandomLayer extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['L', 'N', 'n'],
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
