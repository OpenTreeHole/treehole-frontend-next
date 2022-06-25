import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const jwtAxios = axios.create()

export default class JWTManager {
  failedRequestList: AxiosRequestConfig[] = []
  responseList: PromiseSettledResult<AxiosResponse<any>>[] = []
  refreshing = false
  /**
   * The refresh method which will be called when request failed and was considered needing request.
   */
  refresh: () => Promise<string>

  /**
   * In what condition should the failed request be refreshed and re-sent.
   */
  needRefresh: (originalError: AxiosError) => boolean
  /**
   * The callback method when the refresh method got into error.
   */
  refreshErrorCallback: (refreshError: AxiosError) => void
  interval = 20
  timeout = 10000

  constructor(
    refresh: () => Promise<string> = async () => '',
    needRefresh: (originalError: AxiosError) => boolean = (originalError: AxiosError) => originalError.response?.status === 401,
    refreshErrorCallback: (refreshError: AxiosError) => void = () => {}
  ) {
    this.refresh = refresh
    this.needRefresh = needRefresh
    this.refreshErrorCallback = refreshErrorCallback
  }

  responseErrorInterceptor = async (e: AxiosError) => {
    if (this.needRefresh(e)) {
      this.failedRequestList.push(e.config)
      const id = this.failedRequestList.length - 1
      if (!this.refreshing) {
        // if it's not refreshing, then send the refresh request
        this.refreshing = true
        try {
          const authorization = await this.refresh()
          const requestPromises = this.failedRequestList.map((v) => {
            if (v.headers) {
              v.headers.Authorization = 'Bearer ' + authorization
            }
            return jwtAxios.request(v)
          })
          this.failedRequestList = []
          this.responseList = await Promise.allSettled(requestPromises)
          this.refreshing = false
        } catch (refreshError: any) {
          this.responseList = []
          this.refreshing = false
          this.refreshErrorCallback(refreshError)
          return Promise.reject(e)
        }
      } else {
        // otherwise, save the request and wait for re-sending with refreshed access token.
        for (let waitingTime = 0; waitingTime < this.timeout; waitingTime += this.interval) {
          await new Promise((resolve) => setTimeout(resolve, this.interval))
          if (!this.refreshing) break
        }
      }
      // check if any request has failed.
      if (this.responseList[id]?.status === 'fulfilled') {
        return Promise.resolve((this.responseList[id] as PromiseFulfilledResult<AxiosResponse<any>>).value)
      }
      return Promise.reject(e)
    }
    return Promise.reject(e)
  }
}
