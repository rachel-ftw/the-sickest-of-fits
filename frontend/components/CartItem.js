import React, { Component } from 'react'
import PropTypes from 'prop-types'

import formatMoney from '../lib/formatMoney'
import styled from 'styled-components'
import { checkPropTypes } from 'prop-types';

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
    quantity,
    item: {
      image,
      price,
      title,
    }
  }
}) => {
  return (
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
    </CartItemStyles>
  )
}

CartItem.prototype = {
  cartItem: PropTypes.object.isRequired,
}

export default CartItem
