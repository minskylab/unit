import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { P } from '../../../../../interface/P'
import { S } from '../../../../../interface/S'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { GraphSpecs } from '../../../../../types'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { Dict } from '../../../../../types/Dict'

export interface I {
  init: {}
  system: S
}

export interface O {
  pod: P
}

export default class Spawn extends Semifunctional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['init', 'system'],
        fo: ['pod'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ init, system }: I, done: Done<O>): void {
    const __pod = system.newPod()

    const pod = new (class $Pod extends $ implements P {
      getSpecs(): GraphSpecs {
        throw new Error('Method not implemented.')
      }

      refUnit(id: string): void {
        throw new Error('Method not implemented.')
      }

      refGraph(bundle: BundleSpec): [Dict<string>, Graph] {
        throw new Error('Method not implemented.')
      }
    })(this.__system, this.__pod)

    done({ pod })
  }
}
