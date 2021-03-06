import React, { Component } from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { Query } from 'react-apollo'

import Item from './Item'
import Pagination from './Pagination'
import { perPage } from '../config'

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}, ) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
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

const Items = ({ page }) => (
  <Center>
    <Pagination page={page} />
    <Query
      query={ALL_ITEMS_QUERY}
      variables={{ skip: page * perPage - perPage }}>
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
    <Pagination page={page} />
  </Center>
)


export default Items
