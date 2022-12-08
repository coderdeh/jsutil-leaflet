const getters = {
    is32: state => state.app.is32,
    is21: state => state.app.is21,
    accessToken: state => state.user.accessToken,
    floorArea: state => state.app.floorArea,
    allWarnCount: state => state.app.allWarnCount
}
export default getters