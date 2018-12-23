import React, { Component } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import formatMoney from '../lib/formatMoney'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import Title from './styles/Title'
import DeleteButton from './DeleteItem'

const Item = ({
  item: {
    description,
    id,
    image,
    price,
    title,
  }
}) => (
  <ItemStyles>
    {image && <img src={image} alt={title} />}
    <Title>
      <Link href={{ pathname: '/item', query: { id } }}>
        <a>{title}</a>
      </Link>
    </Title>
    <PriceTag>{formatMoney(price)}</PriceTag>
    <p>{description}</p>
    <div className="buttonLink">
      <Link href={{ pathname: '/update', query: { id } }}>
        <a>Edit ✏️</a>
      </Link>
      <button>Add To Cart</button>
      <DeleteButton id={id}>Delete</DeleteButton>
    </div>
  </ItemStyles>
)

Item.propTypes = {
  item: PropTypes.object.isRequired,
}

export default Item
