import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import DeleteFromCart from './DeleteFromCart'
import formatMoney from '../lib/formatMoney'

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3, p {
    margin: 0;
  }
`

const CartItem = ({
  cartItem: {
    id,
    quantity,
    item: {
      image,
      price,
      title,
    }
  }
}) => (
  <CartItemStyles>
    <img width={100} src={image} alt={title}/>
    <div className="cart-item-details">
      <h3>{title}</h3>
      <p>
        {formatMoney(price * quantity)}
        {' - '}
        <em>{quantity} &times; {formatMoney(price)} each</em>
      </p>
    </div>
    <DeleteFromCart id={id} />
  </CartItemStyles>
)


CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
}

export default CartItem
