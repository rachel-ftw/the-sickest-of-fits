import React from 'react'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import { Query, Mutation } from 'react-apollo'

import calcTotalPrice from '../lib/calcTotalPrice'
import CartItem from './CartItem'
import CartStyles from './styles/CartStyles'
import CloseButton from './styles/CloseButton'
import formatMoney from '../lib/formatMoney'
import SickButton from './styles/SickButton'
import Supreme from './styles/Supreme'
import User from './User'

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`
const Composed = adopt({
  localState: ({ render }) =>
    <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
  toggleCart: ({ render }) =>
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  user: ({ render }) =>
    <User>{render}</User>,
})

const Cart = () => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const { me } = user.data
      const { data } = localState
      const cartSize = me.cart.length
      if (!me) return null

      return (
        <CartStyles open={data.cartOpen}>
          <header>
            <CloseButton
              title="Close"
              onClick={toggleCart}>
              &times;
            </CloseButton>
            <Supreme>{me.name}'s Cart</Supreme>
            <p>
              You have {cartSize} item{cartSize === 1 ? '' : 's'} in your cart.
            </p>
          </header>
          <ul>
            {me.cart.map(
              cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />
            )}
          </ul>
          <footer>
            <p>{formatMoney(calcTotalPrice(me.cart))}</p>
            <SickButton>Checkout</SickButton>
          </footer>
        </CartStyles>
      )
    }}
  </Composed>
)

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION}