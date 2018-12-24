import withApollo from 'next-with-apollo'
import ApolloClient from 'apollo-boost'

import { endpoint } from '../config'
import { LOCAL_STATE_QUERY } from '../components/Cart'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: { credentials: 'include' },
        headers,
      })
    },
    clientState: { // client side aplicaiton state
      defaults: { cartOpen: true },
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY})
            console.log(cartOpen)
            const data = {
              data: { cartOpen: !cartOpen }
            }
            cache.writeData(data)
            return data
          },
        },
      },
    },
  })
}

export default withApollo(createClient)
