import { Graph } from '../Class/Graph'
import { GraphSpecs } from '../types'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'

export interface P {
  refUnit(id: string): void

  refGraph(bundle: BundleSpec): [Dict<string>, Graph]

  getSpecs(): GraphSpecs
}
