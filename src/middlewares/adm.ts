import { userController } from '../controllers'

export const admMiddleware = async (req, res, next) => {
  try {
    const { _id } = req.user
    const userDetails = await userController.findAll({ _id }).select('+su +enable')

    if (userDetails[0]?.su && userDetails[0]?.enable) {
      next()
    } else {
      res.status(403).json({
        message: 'You are not authorized to access this route',
      })
    }
  } catch (error) {
    console.log({ errorAdmMiddleware: error })
    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
