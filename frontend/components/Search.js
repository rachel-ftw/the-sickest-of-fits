import React, { Component } from 'react'
import Downshift, { resetIdCounter } from 'downshift'
import debounce from 'lodash.debounce'
import gql from 'graphql-tag'
import Router from 'next/router'
import { ApolloConsumer } from 'react-apollo'

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY ($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm },
        { description_contains: $searchTerm }
      ]
    }) {
      id
      title
      image
    }
  }
`

const routeToItem = item => {
  Router.push({
    pathname: '/item',
    query: { id: item.id }
  })
}

class AutoComplete extends Component {
  state = {
    items: [],
    loading: false,
  }

  handleChange = debounce(async (e, client) => {
    this.setState({ loading: true })

    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    })

    this.setState({
      items: res.data.items,
      loading: false,
    })
  }, 350)

  render() {
    const { handleChange } = this
    const { items, loading } = this.state
    resetIdCounter()

    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={item => item === null ? '' : item.title}>
          {({
            getInputProps,
            getItemProps,
            highlightedIndex,
            inputValue,
            isOpen,
          }) => (
            <div>
              <ApolloConsumer>
                {(client) => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an Item',
                      id: 'search',
                      className: loading ? 'loading' : '',
                      onChange: e => {
                        e.persist()
                        handleChange(e, client)
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      highlighted={index === highlightedIndex}
                      key={item.id}>
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!items.length && !loading && (
                    <DropDown>Nothing Found for "{inputValue}"</DropDown>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete
