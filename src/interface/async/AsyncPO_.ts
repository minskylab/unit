import { Specs } from '../../types'
import { BundleSpec } from '../../types/BundleSpec'
import { Callback } from '../../types/Callback'
import { P } from '../P'
import { $Graph } from './$Graph'
import { $P, $P_C, $P_R, $P_W } from './$P'
import { AsyncGraph } from './AsyncGraph'

export const AsyncPOCall: (pod: P) => $P_C = (pod) => {
  return {
    $getSpecs(data: {}, callback: Callback<Specs>): void {
      const specs = pod.getSpecs()

      callback(specs)
    },
  }
}

export const AsyncPOWatch: (pod: P) => $P_W = (pod) => {
  return {}
}

export const AsyncPORef: (pod: P) => $P_R = (pod) => {
  return {
    $refGlobalUnit(data: { id: string; _: string[] }): void {},

    $refGraph({ bundle }: { bundle: BundleSpec }): $Graph {
      const [mapping, graph] = pod.refGraph(bundle)

      return AsyncGraph(graph)
    },
  }
}

export const AsyncPO: (pod: P) => $P = (pod: P) => {
  return {
    ...AsyncPOCall(pod),
    ...AsyncPOWatch(pod),
    ...AsyncPORef(pod),
  }
}
