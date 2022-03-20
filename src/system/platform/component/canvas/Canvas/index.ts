import { Element, ElementEE } from '../../../../../Class/Element'
import { CSOpt } from '../../../../../interface/async/$CS'
import { CA } from '../../../../../interface/CA'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Style } from '../../../Props'
import CanvasComp from './Component'

export interface I {
  style?: Style
  width?: number
  height?: number
  d?: any[]
}

export interface O {}

export interface CanvasJ {}
export interface CanvasEE extends ElementEE<{}> {}
export interface CanvasC extends CanvasComp {}

export default class Canvas
  extends Element<I, O, CanvasJ, CanvasEE, CanvasC>
  implements CA
{
  __ = ['U', 'C', 'V', 'J']

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'width', 'height', 'd'],
        o: [],
      },
      {
        output: {
          ctx: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    this._obj = {
      d: [],
    }

    this._component = new CanvasComp({}, this.__system, this.__pod)
  }

  draw(step: any[]): Promise<void> {
    this._obj.d.push(step)
    this._backwarding = true
    this._input.d.pull()
    this._backwarding = false

    this._component.draw(step)

    this.refEmitter().emit('call', { method: 'draw', data: [step] })

    return
  }

  async toBlob(type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this._component.$element.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject('cannot convert canvas to blob')
          }
        },
        type,
        quality
      )
    })
  }

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    return this._component.$element.captureStream(frameRate)
  }
}
