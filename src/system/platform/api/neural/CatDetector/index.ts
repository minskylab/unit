import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  image: any
}

export interface O {
  probability: number
}

export default class CatDetector extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['image'],
        o: ['probability'],
      },
      {},
      system,
      pod
    )
  }

  async f({ image }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        neural: { detectCat },
      },
    } = this.__system

    let probability;

    try {
      probability = await detectCat(image)
    } catch (err) {
      done(undefined, err.message)
      return
    }

    done({ probability})
  }
}
