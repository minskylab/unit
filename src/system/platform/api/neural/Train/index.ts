import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  D: [number[], number[]][]
  I: any
  O: any
}

export interface O {}

export default class Train extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['I', 'O', 'D'],
        o: [],
      },
      {
        input: {
          I: {
            ref: true,
          },
          O: {
            ref: true,
          },
          D: {
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
