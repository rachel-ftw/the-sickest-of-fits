import React, { Component } from 'react'
import gql from 'graphql-tag'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { Query } from 'react-apollo'

import Error from './ErrorMessage'
import formatMoney from '../lib/formatMoney'
import OrderStyles from './styles/OrderStyles'

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`

export class Order extends Component {
  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>

          const { id, charge, createdAt, total, items } = data.order
          return (
            <OrderStyles>
              <Head>
                <title>Sick Fits - Order {id}</title>
              </Head>
              <p>
                <span>Order ID</span>
                <span>{id}</span>
              </p>
              <p>
                <span>Charge</span>
                <span>{charge}</span>
              </p>
              <p>
                <span>Date</span>
                <span>{format(createdAt, 'MMMM d, YYYY h:mm a')}</span>
              </p>
              <p>
                <span>Order Total</span>
                <span>{formatMoney(total)}</span>
              </p>
              <p>
                <span>Item Count</span>
                <span>{items.length}</span>
              </p>
              <div className="items">
                {items.map(item => (
                  <div key={item.id} className="order-item">
                    <img width={100} src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>SubTotal: {formatMoney(item.quantity * item.price)}</p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          )
        }}
      </Query>
    )
  }
}

Order.propTypes = {
  id: PropTypes.string,
}

export default Order
