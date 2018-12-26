import React from 'react'
import gql from 'graphql-tag'
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

const Cart = () => (
  <User>
    {({ data: { me }}) => {
      if (!me) return null
      const cartSize = me.cart.length
      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data }) => (
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
                    {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}
                  </ul>
                  <footer>
                    <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      )
    }}
  </User>
)

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION}