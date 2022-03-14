import { $ } from '../../../Class/$'
import { Done } from '../../../Class/Functional/Done'
import { Semifunctional } from '../../../Class/Semifunctional'
import { S } from '../../../interface/S'
import { U } from '../../../interface/U'
import { Pod } from '../../../pod'
import { System } from '../../../system'

export interface I<T> {
  opt: U
  done: T
}

export interface O<T> {
  system: S
}

export default class Boot<T> extends Semifunctional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['init'],
        fo: ['system'],
        i: ['done'],
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

  async f({ opt }: I<T>, done: Done<O<T>>) {
    const {
      api: {
        init: { boot },
      },
    } = this.__system

    const _system = boot()

    const system = new (class System extends $ implements S {
      newPod(): string {
        throw new Error('Method not implemented.')
      }
    })(this.__system, this.__pod)

    done({
      system,
    })
  }

  onIterDataInputData(name: string) {
    // if (name === 'destroy') {
    this._forward_empty('system')

    this._backward('done')
    // }
  }
}
