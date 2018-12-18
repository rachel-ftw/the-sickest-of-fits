import React, { Component } from 'react'
import gql from 'graphql-tag'
import Router from 'next/router'
import { Mutation, Query } from 'react-apollo'

import Error from './ErrorMessage'
import Form from './styles/Form'

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      description
      id
      price
      title
    }
  }
`

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $description: String
    $id: ID!
    $price: Int
    $title: String
  ) {
    updateItem(
      id: $id
      description: $description
      price: $price
      title: $title
    ) {
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component {
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  handleSubmit = async (e, updateItemMutation) => {
    e.preventDefault()
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })

    // Router.push({
    //   pathname: '/item',
    //   query: { id: this.props.id }
    // })
  }

  render() {
    const { handleSubmit, handleChange } = this
    const { id } = this.props

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading }) => {
          if (loading) return <p>loading...</p>
          if (!data.item) return <p>No item found for ID {this.props.id}</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => handleSubmit(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        defaultValue={data.item.title}
                        onChange={handleChange}/>
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}/>
                    </label>
                    <label htmlFor="description">
                      description
                      <textarea
                        id="description"
                        name="description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}/>
                    </label>
                    <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem
