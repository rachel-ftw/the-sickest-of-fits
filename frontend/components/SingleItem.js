import React, { Component } from 'react'
import gql from 'graphql-tag'
import Head from 'next/head'
import styled from 'styled-components'
import { Query } from 'react-apollo'

import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      description
      title
      price
      largeImage
    }
  }
`

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

class SingleItem extends Component {
  render() {
    const { id } = this.props.query
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ error, data, loading }) => {
          if (error) return <Error error={error} />
          if (loading) return <p>loading...</p>
          if (!data.item) return <p>No item found...</p>

          const { largeImage, title, description } = data.item
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {title}</title>
              </Head>
              <img src={largeImage} alt={title}/>
              <div className="details">
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    )
  }
}

export default SingleItem
