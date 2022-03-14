import { Req } from '../req'

export const authHeaderMid = () => {
  // TODO
  return async function (req: Req, res, next) {
    try {
      next()
    } catch (err) {
      res.status(401).send({})
    }
  }
}
