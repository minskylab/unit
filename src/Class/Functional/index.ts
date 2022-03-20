import { Pod } from '../../pod'
import { Primitive, PrimitiveEvents } from '../../Primitive'
import { System } from '../../system'
import forEachKeyValue from '../../system/core/object/ForEachKeyValue/f'
import { Dict } from '../../types/Dict'
import { filterObj } from '../../util/object'
import { ION, Opt } from '../Unit'
import { Done } from './Done'

export type Functional_EE = {}

export type FunctionalEvents<_EE extends Dict<any[]>> = PrimitiveEvents<
  _EE & Functional_EE
> &
  Functional_EE

export class Functional<
  I = {},
  O = {},
  _EE extends FunctionalEvents<_EE> = FunctionalEvents<Functional_EE>
> extends Primitive<I, O, _EE> {
  private _looping: boolean = false

  constructor({ i, o }: ION = {}, opt: Opt = {}, system: System, pod: Pod) {
    super({ i, o }, opt, system, pod)

    this.addListener('take_err', () => {
      if (this._looping) {
        this._backward_if_ready()
      }
    })

    this.addListener('take_caught_err', () => {
      if (!this.hasErr()) {
        this._backward_if_ready()
      }
    })
  }

  private _on_input_data(name: string): void {
    if (this._i[name] !== undefined && this._active_i_count === this._i_count) {
      this._looping = false
    }
    this._forward_if_ready()
  }

  private _on_input_drop(): void {
    if (this._active_i_count === this._i_count - 1) {
      if (!this._backwarding && !this._forwarding_empty) {
        this._looping = false
        if (this._catchErr) {
          this.takeCaughtErr()
        } else {
          this.takeErr()
        }
        this.d()
        this._forward_all_empty()
      }
    }
  }

  private _on_input_invalid(name: string): void {
    if (this._i_invalid_count === 1) {
      this.i(name)
      this._invalidate()
    }
  }

  onDataInputData(name: string): void {
    this._on_input_data(name)
  }

  onDataInputDrop(name: string): void {
    this._on_input_drop()
  }

  onDataInputStart(name: string): void {
    if (this._i_start_count === this._i_count) {
      this._start()
    }
  }

  onDataInputInvalid(name: string): void {
    this._on_input_invalid(name)
  }

  onDataInputEnd(name: string): void {
    if (this._i_start_count === this._i_count - 1) {
      this._end()
    }
  }

  onRefInputData(name: string): void {
    this._on_input_data(name)
  }

  onRefInputDrop(): void {
    this._on_input_drop()
  }

  onRefInputInvalid(name: string): void {
    this._on_input_invalid(name)
  }

  private _on_data_output_drop = (name: string): void => {
    this._backward_if_ready()
    this._forward_if_ready()
  }

  onDataOutputDrop(name: string) {
    this._on_data_output_drop(name)
  }

  f(i: Partial<I>, done: Done<O>) {}

  i(name: string) {}

  d() {}

  private _backward_if_ready(): void {
    if (
      !this._forwarding_empty &&
      !this._forwarding &&
      !this._err &&
      !this._caughtErr &&
      this._active_o_count === 0
    ) {
      this._looping = false
      this._backward_all()

      // without setTimeout an infinite loop will turn into a stack overflow
      // setTimeout(() => {
      this._forward_if_ready()
      // }, 0)
    }
  }

  private _forward_if_ready() {
    // console.log('Functional', '_forward_if_ready')
    while (
      this._active_o_count - this._o_invalid_count === 0 &&
      this._active_i_count - this._i_invalid_count === this._i_count &&
      !this._forwarding &&
      !this._backwarding &&
      !this._looping // prevent async infinite while loop
    ) {
      this._looping = true

      if (this._err !== null) {
        this._forwarding_empty = true
        this.takeErr()
        this._forwarding_empty = false
      }

      this.f(this._i, this._done)
    }
  }

  public _done: Done<O> = (data, err = null) => {
    if (err) {
      this._forwarding = true
      this.err(err)
      this._forwarding = false
      this._forward_all_empty()
    } else {
      if (data !== undefined) {
        const output_empty = filterObj(this._output, (o) => o.empty())
        const output_not_empty = filterObj(this._output, (o) => !o.empty())
        const push_or_pull = (output, name) => {
          const o = data[name]
          if (o === undefined) {
            output.pull()
          } else {
            output.push(o)
          }
        }
        this._forwarding = true
        forEachKeyValue(output_empty, push_or_pull)
        forEachKeyValue(output_not_empty, push_or_pull)
        this._forwarding = false
      }
    }
    this._backward_if_ready()
  }
}
