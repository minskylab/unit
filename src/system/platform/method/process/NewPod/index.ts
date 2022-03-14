import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Graph } from '../../../../../Class/Graph'
import { P } from '../../../../../interface/P'
import { Pod } from '../../../../../pod'
import { spawn } from '../../../../../spawn'
import { System } from '../../../../../system'
import { GraphSpecs } from '../../../../../types'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { Dict } from '../../../../../types/Dict'

export interface I {
  opt: {
    specs?: GraphSpecs
    sandbox?: string[]
  }
}

export interface O {
  pod: P
}

export default class NewPod extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt'],
        o: ['pod'],
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

  f({ opt }: I, done: Done<O>): void {
    const { specs, sandbox } = opt

    const __pod = spawn(this.__system)

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
