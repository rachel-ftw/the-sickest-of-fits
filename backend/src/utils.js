const jwt = require('jsonwebtoken')

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  )
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions: ${permissionsNeeded}

      You Have: ${user.permissions}
      `)
  }
}

const signJWTAndCreateCookie = (user, ctx) => {
  const oneYear = 1000 * 60 * 60 * 24 * 365
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: oneYear,
  })
}

const checkIfLoggedIn = ctx => {
  if (!ctx.request.userId) throw new Error('You must be logged in to do that.')
}

module.exports = {
  checkIfLoggedIn,
  hasPermission,
  signJWTAndCreateCookie,
}
