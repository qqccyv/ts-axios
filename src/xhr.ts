import { createError } from './helpers/error'
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
      reject(createError('request is failed', config, null, request))
    }
    request.ontimeout = function timeoutHandler() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'timeout', request))
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
        reject(createError(`request is failed with code ${res.statusText}`, config, null, res))
      }
    }
  })
}

export default xhr
