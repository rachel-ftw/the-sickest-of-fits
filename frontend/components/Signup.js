import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signUp(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

export class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitHandler = async (e, signUp) => {
    e.preventDefault()
    await signUp()
    this.setState({ name: '', email: '', password: ''})
  }

  render() {
    const { submitHandler, saveToState } = this
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signUp, { loading, error }) => {
          return (
            <Form method="post" onSubmit={e => submitHandler(e, signUp)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for an Account</h2>
              <Error error={error} />
              <label htmlFor="name">
                name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={this.state.name}
                  onChange={saveToState}/>
              </label>
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

              <button type="submit">Sign Up</button>
            </fieldset>
          </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default Signup
