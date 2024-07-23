import axios from "axios";

/**
 * This function is used to prevent axios repetition
 * @param {string} method The method of the axios request.
 * @param {string} uri The uri of the axios request.
 * @param {object} data It containes the  data while need to post update and many more.
 * @returns {function} axios This is the proper axios function depending on the params.
 */
const req = ({ method, uri, data }) => {
    let url = uri.startsWith('https://') || uri.startsWith('http://') ? uri : `${process.env.REACT_APP_SERVER_URL || 'https://localhost:9998/api'}/${uri}`
    var payload = {
        method,
        url,
        data
    }
    return axios(payload)
}
export default req;