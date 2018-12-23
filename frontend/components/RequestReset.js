import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import Error from './ErrorMessage'
import Form from './styles/Form'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export class RequestReset extends Component {
  state = { email: '' }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitHandler = async (e, requestReset) => {
    e.preventDefault()
    await requestReset()
    this.setState({ email: '' })
  }

  render() {
    const { submitHandler, saveToState } = this
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestReset, { loading, error, called }) => {
          return (
            <Form method="post" onSubmit={e => submitHandler(e, requestReset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your Password</h2>
              <Error error={error} />
              {!error && !loading && called && <p>Check your email for a reset link.</p>}
              <label htmlFor="email">
                email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={saveToState}/>
              </label>
              <button type="submit">Reset</button>
            </fieldset>
          </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default RequestReset
