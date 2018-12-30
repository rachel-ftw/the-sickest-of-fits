import React, { Component } from 'react'
import gql from 'graphql-tag'
// import NProgress from 'nprogress'
// import PropTypes from 'prop-types'
// import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'

import calcTotalPrice from '../lib/calcTotalPrice'
// import Error from './ErrorMessage'
import User, { CURRENT_USER_QUERY } from './User'

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

class TakeMyMoney extends Component {
  handleToken = (res, createOrder) => {
    createOrder({ variables: { token: res.id } })
      .catch(err => alert(err.message))
  }

  render() {
    const { children } = this.props
    const { handleToken } = this

    return (
      <User>
        {({ data: { me }}) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
            {(createOrder) => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)} items.`}
                image={me.cart[0].item && me.cart[0].item.image}
                stripeKey="pk_test_7fngsGHhJ2fbVLAxU8NtsO2G"
                currency="USD"
                email={me.email}
                token={res => handleToken(res, createOrder)}
              >
                {children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    )
  }
}

export default TakeMyMoney
