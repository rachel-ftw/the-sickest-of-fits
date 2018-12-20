import React from 'react'
import gql from 'graphql-tag'
import Head from 'next/head'
import Link from 'next/link'
import PaginationStyles from './styles/PaginationStyles'
import { Query } from 'react-apollo'

import Error from './ErrorMessage'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = ({ page }) => {

  return (
    <Query query={PAGINATION_QUERY}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error.message} />
          if (loading) return <p>loading...</p>

          const { count } = data.itemsConnection.aggregate
          const pages = Math.ceil(count / perPage)

          return (
            <PaginationStyles>
              <Head>
                <title>Sick Fits! - page {page} of {pages}</title>
              </Head>
              <Link
                prefetch
                href={{
                  pathname: '/items',
                  query: { page: page - 1 },
                }}>
                <a className="prev" aria-disabled={page <= 1}>← prev</a>
              </Link>
              <p>Page {page} of {pages}</p>
              <p>{count} items total</p>
              <Link href={{
                pathname: '/items',
                query: { page: page + 1 },
              }}>
                <a className="next" aria-disabled={page >= pages}>next →</a>
              </Link>
            </PaginationStyles>
          )
        }}
      </Query>
  )
}

export default Pagination
