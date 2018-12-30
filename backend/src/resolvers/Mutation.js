const bcrypt = require('bcryptjs')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

const stripe = require('../stripe')
const {
  checkIfLoggedIn,
  hasPermission,
  signJWTAndCreateCookie,
} = require('../utils')
const { transport, makeANiceEmail } = require('../mail')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    checkIfLoggedIn(ctx)

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
    checkIfLoggedIn(ctx)
    const updates = {...args}
    delete updates.id
    return ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id }
    }, info)
  },

  async deleteItem(parent, args, ctx, info) {
    checkIfLoggedIn(ctx)

    const where = { id: args.id }
    const item = await ctx.db.query.item({ where }, '{ id title user { id } }')
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(
      permission => ['ADMIN', 'ITEMDELETE'].includes(permission)
    )

    if (!ownsItem || !hasPermissions) {
      throw new Error('Sorry, You don\'t have permission to do that')
    }

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
    // TODO check that mail was successful

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
  },

  async updatePermissions(parent, args, ctx, info) {
    checkIfLoggedIn(ctx)
    const user = await ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info)
    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE'])
    return ctx.db.mutation.updateUser({
      where: { id: args.userId },
      data: {
        permissions: { set: args.permissions },
      },
    }, info)
  },

  async addToCart(parent, args, ctx, info) {
    checkIfLoggedIn(ctx)
    const { userId } = ctx.request

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    })

    if (existingCartItem) {
      console.log('item is already in cart')
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1}
      }, info)
    }

    return ctx.db.mutation.createCartItem({
      data: {
        user: { connect: { id: userId } },
        item: { connect: { id: args.id } },
      }
    }, info)
  },

  async deleteFromCart(parent, args, ctx, info) {
    const cartItem = await ctx.db.query.cartItem({
      where: { id: args.id }
    }, `{ id, user { id } }`)
    if (!cartItem) throw new Error('No Cart Item Found')
    if (cartItem.user.id !== ctx.request.userId) throw new Error('no cheating')

    return ctx.db.mutation.deleteCartItem({
      where: { id: args.id }
    })
  },

  async createOrder(parent, args, ctx, info) {
    checkIfLoggedIn(ctx)
    const { userId } = ctx.request
    const user = await ctx.db.query.user({ where: { id: userId } }, `{
      email
      id
      name
      cart {
        id
        quantity
        item {
          description
          id
          image
          price
          title
        }
      }
    }`)

    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0
    )

    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token,
    })
  },
}

module.exports = Mutations
