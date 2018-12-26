import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {

  handleClick = (e, deleteItemMutation) => {
    if (confirm('You sure you want to delete this? No backsies.')) {
      deleteItemMutation().catch(err => alert(err.message))
    }
  }

  handleUpdate = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })

    data.items = data.items
      .filter(item => item.id !== payload.data.deleteItem.id)

    cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
  }

  render() {
    const { handleClick, handleUpdate } = this
    const { children, id } = this.props

    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={handleUpdate}>
        {(deleteItem, { error }) => (
          <button onClick={e => handleClick(e, deleteItem)}>{children}</button>
        )}
      </Mutation>
    )
  }
}

export default DeleteItem
