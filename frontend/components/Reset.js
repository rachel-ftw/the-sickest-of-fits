import React, { Component } from 'react'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'

import Error from './ErrorMessage'
import Form from './styles/Form'
import { CURRENT_USER_QUERY } from './User'

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
    ) {
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`

export class ResetPassword extends Component {
  state = {
    confirmPassword: '',
    password: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitHandler = async (e, resetPassword) => {
    e.preventDefault()
    await resetPassword()
    this.setState({ password: '', confirmPassword: '' })
  }

  render() {
    const { submitHandler, saveToState } = this
    const { resetToken } = this.props

    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ ...this.state, resetToken }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(resetPassword, { loading, error }) => {
          return (
            <Form method="post" onSubmit={e => submitHandler(e, resetPassword)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password</h2>
              <Error error={error} />
              <label htmlFor="password">
                new password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={saveToState}/>
              </label>
              <label htmlFor="confirmPassword">
                confirm you password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={saveToState}/>
              </label>
              <button type="submit">Save</button>
            </fieldset>
          </Form>
          )
        }}
      </Mutation>
    )
  }
}

ResetPassword.propTypes = {
  resetToken: PropTypes.string.isRequired,
}

export default ResetPassword
