import { ResolveFn, RejectedFn } from './../types/index'
interface Interceptor<T> {
  resolved: ResolveFn<T>
  rejected?: RejectedFn
}
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }
  use(resolved: ResolveFn<T>, rejected?: RejectedFn): number {
    return (
      this.interceptors.push({
        resolved,
        rejected
      }) - 1
    )
  }
  forEach(fun: (intercepter: Interceptor<T>) => void) {
    this.interceptors.forEach(interceptor => {
      interceptor && fun(interceptor)
    })
  }
  eject(id: number) {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
