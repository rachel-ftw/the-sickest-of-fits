import React, { Component } from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { Query } from 'react-apollo'

import Item from './Item'
import Pagination from './Pagination'

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination />
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, loading, error }) => {
            if(loading) return <p>loading...</p>
            if(error) return <p>Error: {error.message}</p>

            return (
              <ItemsList>
                {data.items.map(item =>
                  <Item key={item.id} item={item}>{item.title}</Item>
                )}
              </ItemsList>
            )
          }}
        </Query>
        <Pagination />
      </Center>
    )
  }
}

export default Items
