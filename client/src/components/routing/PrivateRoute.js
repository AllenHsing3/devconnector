import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// We will need connect for bringing in auth
// Destructure the component and the rest
const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login' />) : (<Component {...props} />)} />
)

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}


// Takes in the auth from reducer
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps) (PrivateRoute)
