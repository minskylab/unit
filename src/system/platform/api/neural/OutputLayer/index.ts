import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  L: number[]
}

export interface O {}

export default class OutputLayer extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['L'],
        o: [],
      },
      {
        input: {
          L: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      pod
    )
  }

  async f({}: I, done: Done<O>): Promise<void> {}
}
