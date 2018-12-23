const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

const { transport, makeANiceEmail } = require('../mail')

const signJWTAndCreateCookie = (user, ctx) => {
  const oneYear = 1000 * 60 * 60 * 24 * 365
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  ctx.response.cookie('token', token, { httpOnly: true, maxAge: oneYear })
}

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You must be logged in to do that.')

    const item = await ctx.db.mutation.createItem({
      data: {
        user: {
          connect: {
            id: ctx.request.userId,
          },
        },
        ...args
      }
    }, info)

    return item
  },

  updateItem(parent, args, ctx, info) {
    const updates = {...args}
    delete updates.id
    return ctx.db.mutation.updateItem({
        data: updates,
        where: { id: args.id }
      },
      info
    )
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    const item = await ctx.db.query.item({ where }, `{ id title }`)
    // TODO check if they have permissions to delete
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase()
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] },
      }
    }, info)

    signJWTAndCreateCookie(user, ctx)

    return user
  },

  async signIn(parent, { email, password }, ctx, info) {
    email = email.toLowerCase()
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) throw new Error(`No such user found for email ${email}`)

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Invalid Password!')

    signJWTAndCreateCookie(user, ctx)

    return user
  },

  signOut(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: "Successfully logged out!" }
  },

  async requestReset(parent, { email }, ctx, info) {
    email = email.toLowerCase()
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) throw new Error(`No such user found for email ${email}`)
    const resetToken = (await promisify(randomBytes)(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    })

    const mailRes = await transport.sendMail({
      from: 'rachel@rachelralston.com',
      to: user.email,
      subject: 'Your Sick Fits Password Reset Token',
      html: makeANiceEmail(`
        Your password reset is ready!
        \n\n
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset.</a>
      `)
    })

    return { message: "Successfully requested password reset." }
  },

  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error('passwords must match')
    }

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      }
    })
    if (!user) throw new Error('This token is either invalid or expired.')

    const password = await bcrypt.hash(args.password, 10)
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    signJWTAndCreateCookie(updatedUser, ctx)

    return updatedUser
  }
}

module.exports = Mutations
