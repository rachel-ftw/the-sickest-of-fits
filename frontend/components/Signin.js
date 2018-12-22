import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import Error from './ErrorMessage'
import Form from './styles/Form'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

export class Signin extends Component {
  state = {
    email: '',
    password: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitHandler = async (e, signIn) => {
    e.preventDefault()
    await signIn()
    this.setState({ email: '', password: ''})
  }

  render() {
    const { submitHandler, saveToState } = this
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        variables={this.state}>
        {(signIn, { loading, error }) => {
          return (
            <Form method="post" onSubmit={e => submitHandler(e, signIn)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign into your Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={saveToState}/>
              </label>
              <label htmlFor="password">
                password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={saveToState}/>
              </label>
              <button type="submit">Sign In</button>
            </fieldset>
          </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default Signin
