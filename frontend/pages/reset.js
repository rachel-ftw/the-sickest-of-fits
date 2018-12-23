import ResetPassword from "../components/Reset"

const reset = props => (
  <div>
    <ResetPassword resetToken={props.query.resetToken} />
  </div>
)

export default reset