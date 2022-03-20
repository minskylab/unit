import { Unit } from '../Class/Unit'
import { Pod } from '../pod'
import { System } from '../system'
import { UnitBundleSpec } from './UnitBundleSpec'

export type UnitClass<T extends Unit = any> = {
  __bundle?: UnitBundleSpec

  new (system: System, pod: Pod): T
}
