import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Alert type will dynamically change to CSS style
const Alert = ({ alerts }) =>  // destructure props to alerts
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ))


Alert.propTypes = {
    alerts: PropTypes.array.isRequired, // PTAR
}

const mapStateToProps = state => ({ //Get alerts from state
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert)
