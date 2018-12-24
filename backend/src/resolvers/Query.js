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
}

module.exports = Query
