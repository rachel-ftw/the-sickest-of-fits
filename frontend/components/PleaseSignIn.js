import { Query } from 'react-apollo'

import Signin from './Signin'
import { CURRENT_USER_QUERY } from './User'

const PleaseSignIn = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
  {({ data, loading }) => {
    if(loading) return <p>Loading..</p>
    if (!data.me) {
      return (
        <div>
          <p>Please Sign In before continuing.</p>
          <Signin />
        </div>
      )
    }
    return children
  }}
  </Query>
)

export default PleaseSignIn