import { Unit } from '../../../Class/Unit'
import { S } from '../../../interface/S'
import { Pod } from '../../../pod'
import { System } from '../../../system'

export interface I<T> {}

export interface O<T> {}

export default class _System<T> extends Unit<I<T>, O<T>> implements S {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: [],
        o: [],
      },
      {
        output: {
          system: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  newPod(): string {
    throw new Error('Method not implemented.')
  }
}
