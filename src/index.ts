import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'
import { buildURL } from './helpers/url'
import { AxiosRquestConfig, AxiosPromise, AxiosResponse } from './types/index'
import xhr from './xhr'

function axios(config: AxiosRquestConfig): AxiosPromise {
  processConfig(config)
  // toto
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRquestConfig): void {
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
  config.headers = transformHeaders(config)
}
function transformUrl(config: AxiosRquestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}
function transformRequestData(config: AxiosRquestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRquestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData(data: AxiosResponse): AxiosResponse {
  data.data = transformResponse(data.data)
  return data
}

export default axios
