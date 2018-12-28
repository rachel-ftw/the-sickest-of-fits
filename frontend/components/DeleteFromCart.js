import React, { Component } from 'react'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

const DELETE_FROM_CART_MUTATION = gql`
  mutation DELETE_FROM_CART_MUTATION($id: ID!) {
    deleteFromCart(id: $id) {
      id
    }
  }
`
// TODO: need a decrement cartItem if there are multiple of a single item. Delete currently deletes all of that item type.

class DeleteFromCart extends Component {
  update = (cache, payload) => {
    // gets called when we get a response back from server after mutation.
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    const cartItemId = payload.data.deleteFromCart.id

    data.me.cart = data.me.cart.filter(cartItem => cartItemId !== cartItem.id)
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }

  render() {
    const { id } = this.props
    return (
      <Mutation
        mutation={DELETE_FROM_CART_MUTATION}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          deleteFromCart: {
            __typename: 'CartItem',
            id
          },
        }}
        variables={{ id }}>
        {(deleteFromCart, { loading }) => (
          <BigButton
            disabled={loading}
            onClick={() => { deleteFromCart().catch(err => alert(err.message)) }}
            title="delete item">
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

DeleteFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default DeleteFromCart
