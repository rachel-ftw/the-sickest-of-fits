import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { CURRENT_USER_QUERY } from './User'

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

const AddToCart = ({ id }) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
      {(addToCart, { loading }) => (
        <button disabled={loading} onClick={addToCart}>
          Add{loading && 'ing'} To Cart 🛒
        </button>
      )}
  </Mutation>
)

export default AddToCart
export { ADD_TO_CART_MUTATION }
