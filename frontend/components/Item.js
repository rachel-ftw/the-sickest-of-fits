import React, { Component } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import formatMoney from '../lib/formatMoney'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import Title from './styles/Title'

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  render() {
    const { description, id, image, price, title } = this.props.item

    return (
      <ItemStyles>
        {image && <img src={image} alt={title} />}
        <Title>
          <Link href={{ pathName: '/item', query: { id } }}>
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
          <button>Delete</button>
        </div>
      </ItemStyles>
    )
  }
}

export default Item
