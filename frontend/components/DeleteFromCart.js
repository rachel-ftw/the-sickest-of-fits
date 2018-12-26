import React from 'react'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'

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

const DeleteFromCart = ({ id }) => (
  <Mutation
    mutation={DELETE_FROM_CART_MUTATION}
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

DeleteFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default DeleteFromCart
