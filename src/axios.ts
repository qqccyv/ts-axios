import { AxiosInstance } from '.'
import Axios from './core/axios'
// import { extend } from "./helpers/util";

function createInstance(): AxiosInstance {
  const context = new Axios()
  // const instance = Axios.prototype.request.bind(context)
  // extend(instance, context)
  const instance = Axios.prototype.request
  Object.setPrototypeOf(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()
export default axios
