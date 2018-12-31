const { forwardTo } = require('prisma-binding')
const { hasPermission, checkIfLoggedIn } = require('../utils')

const Query = {
  item: forwardTo('db'),

  items: forwardTo('db'),

  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    if (!ctx.request.userId) return null
    return ctx.db.query.user({
      where: {
        id: ctx.request.userId
      }
    }, info)
  },

  async users(part, args, ctx, info) {
    checkIfLoggedIn(ctx)
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

    return await ctx.db.query.users({}, info)
  },

  async order(parent, args, ctx, info) {
    checkIfLoggedIn(ctx)
    hasPermission(ctx.request.user, ['ADMIN'])

    const order = await ctx.db.query.order({ where: { id: args.id} }, info)

    const ownsOrder = order.user.id === ctx.request.userId
    if(!ownsOrder) throw new Error('You can only see your own orders.')

    return order
  },
}

module.exports = Query
