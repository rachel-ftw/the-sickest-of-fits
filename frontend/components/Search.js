import React from 'react'
import debounce from 'lodash.debounce'
import Downshift from 'downshift'
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

class AutoComplete extends React.Component {
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
    const { items } = this.state

    const searchResults = items.map(item => (
      <DropDownItem key={item.id}>
        <img width="50" src={item.image} alt={item.title} />
        {item.title}
      </DropDownItem>
    ))

    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {(client) => (
              <input type="search" onChange={e => {
                e.persist()
                handleChange(e, client)
              }} />
            )}
          </ApolloConsumer>
          <DropDown>
            {searchResults}
          </DropDown>
        </div>
      </SearchStyles>
    )
  }
}

export default AutoComplete
