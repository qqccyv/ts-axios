import { parseHeaders } from './helpers/headers'
import { AxiosResponse, AxiosRquestConfig, AxiosPromise } from './types/index'

const xhr = (config: AxiosRquestConfig): AxiosPromise => {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url, true)

    if (responseType) {
      request.responseType = responseType
    }
    // 设置超时时间
    if (timeout) {
      request.timeout = timeout
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    // 错误处理
    request.onerror = function errorHandler() {
      reject(new Error('request is failed'))
    }
    request.ontimeout = function timeoutHandler() {
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }
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

    function responseHandler(res: AxiosResponse) {
      const { status } = res
      if (status >= 200 && status < 300) {
        resolve(res)
      } else {
        reject(new Error(`request is failed with code ${res.statusText}`))
      }
    }
  })
}

export default xhr
