import React, { Component } from 'react'
import gql from 'graphql-tag'
import Router from 'next/router'
import { Mutation } from 'react-apollo'

import Error from './ErrorMessage'
import Form from './styles/Form'

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
    $title: String!
  ) {
    createItem(
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
      title: $title
    ) {
      id
    }
  }
`

class CreateItem extends Component {
  state = {
    description: '',
    image: '',
    largeImage: '',
    price: 0,
    title: '',
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  handleSubmit = async (e, createItem) => {
    e.preventDefault()
    const res = await createItem()
    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id }
    })
  }

  uploadFile = async e => {
    console.log('uploading...')
    const { files } = e.target
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'sickfits')
    // https://res.cloudinary.com/rachel-ftw/image/upload/v1545071579/sample.jpg
    const res = await fetch('https://api.cloudinary.com/v1_1/rachel-ftw/image/upload', {
      method: 'POST',
      body: data
    })

    const file = await res.json()
    console.log(file)
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    })
  }

  render() {
    const { handleSubmit, handleChange, uploadFile } = this
    const { title, price, description, image } = this.state

    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={e => handleSubmit(e, createItem)}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="file"
                  required
                  onChange={uploadFile}/>
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={title}
                  onChange={handleChange}/>
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={price}
                  onChange={this.handleChange}/>
              </label>
              <label htmlFor="description">
                description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a Description"
                  required
                  value={description}
                  onChange={this.handleChange}/>
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>

    )
  }
}

export default CreateItem
