import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { CSOpt } from '../../../../../interface/async/$CS'
import { CS } from '../../../../../interface/CS'
import { ST } from '../../../../../interface/ST'
import { ObjectSource } from '../../../../../ObjectSource'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { Unlisten } from '../../../../../types/Unlisten'

export interface I {
  source: CS
  opt: CSOpt
  stop: any
}

export interface O {}

export default class CaptureStream extends Semifunctional<I, O> implements ST {
  __ = ['U', 'ST']

  private _stream: ObjectSource<MediaStream> = new ObjectSource()

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['source', 'opt'],
        fo: [],
        i: ['stop'],
        o: [],
      },
      {
        input: {
          source: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ source, opt }: I, done: Done<O>): Promise<void> {
    let stream: MediaStream

    try {
      stream = await source.captureStream(opt)

      console.log('RETURN', stream)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    this._stream.set(stream)
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'stop') {
    this._stream.set(null)

    this._done()

    this._input.stop.pull()
    // }
  }

  stream(callback: Callback<MediaStream>): Unlisten {
    return this._stream.connect(callback)
  }
}
