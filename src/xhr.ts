import { parseHeaders } from './helpers/headers'
import { AxiosResponse, AxiosRquestConfig, AxiosPromise } from './types/index'

const xhr = (config: AxiosRquestConfig): AxiosPromise => {
  return new Promise(resolve => {
    const { url, method = 'get', data = null, headers, responseType } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url, true)

    if (responseType) {
      request.responseType = responseType
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    request.onreadystatechange = function handlLoad() {
      if (request.readyState !== 4) return
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }
  })
}

export default xhr
