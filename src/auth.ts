import { connect } from './api/auth'

const params = new URLSearchParams(location.search)
const code = params.get('code')
const state = params.get('state')

connect(code, state)
