// noinspection DuplicatedCode

import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import config from '@/config'
import router from '@/router'
import { camelizeKeys, snakifyKeys } from '@/utils/utils'
import LocalStorageStore from '@/store/modules/LocalStorageStore'
import { IPunishment, IUserAuth, IUserAuthData, Punishment, User, UserAuth } from '@/models/user'
import { Division, IDivision, IDivisionAdd, IDivisionModify } from '@/models/division'
import { DetailedFloor, IDetailedFloor, IFloorData } from '@/models/floor'
import { Hole, IHole } from '@/models/hole'
import { ITag, Tag } from '@/models/tag'
import { IReport, IReportDeal, Report } from '@/models/report'
import JWTManager from '@/apis/jwt'
import Cookies from 'js-cookie'

const authAxios = axios.create()
const refreshAxios = axios.create()

/**
 * Error caused by axios (or other api interaction)
 */
export class ApiError extends Error {
  originalError: AxiosError

  constructor(originalError: AxiosError, message?: string, options?: any) {
    super(message, options)
    this.originalError = originalError
  }
}

// const refreshAuthLogic = async (failedRequest: AxiosError) => {
//   try {
//     const response = await refresh()
//     if (response.refresh && response.access) {
//       LocalStorageStore.setRefreshToken(response.refresh)
//       LocalStorageStore.setToken(response.access)
//       if (failedRequest.response?.config.headers) {
//         failedRequest.response.config.headers.Authorization = 'Bearer ' + response.access
//       }
//       return
//     }
//   } catch (e: any) {
//     LocalStorageStore.setToken('')
//     LocalStorageStore.setRefreshToken('')
//     localStorage.removeItem('token')
//     localStorage.removeItem('refresh')
//     if (router.currentRoute.name !== 'login') {
//       await router.replace({
//         name: 'login'
//       })
//       if (e.response.data.message) return Promise.reject(new ApiError(e, `${e.response.status}: ${e.response.data.message}`))
//       else return Promise.reject(new ApiError(e, '会话已过期，请重新登录'))
//     }
//   }
//   return Promise.reject(failedRequest)
// }

// createAuthRefreshInterceptor(axios, refreshAuthLogic)
// createAuthRefreshInterceptor(authAxios, refreshAuthLogic)
const jwt = new JWTManager(async () => (await refresh()).access)
jwt.refreshErrorCallback = async (refreshError) => {
  if (refreshError.response?.status === 401) {
    LocalStorageStore.setToken('')
    LocalStorageStore.setRefreshToken('')
    if (router.currentRoute.name !== 'login') {
      await router.replace({
        name: 'login'
      })
      if (refreshError.response?.data.message) return Promise.reject(new ApiError(refreshError, `${refreshError.response.status}: ${refreshError.response.data.message}`))
      else return Promise.reject(new ApiError(refreshError, '会话已过期，请重新登录'))
    }
  }
}
axios.interceptors.response.use((response) => response, jwt.responseErrorInterceptor)
authAxios.interceptors.response.use((response) => response, jwt.responseErrorInterceptor)

const requestInterceptor = (config: AxiosRequestConfig) => {
  const token = Cookies.get('access')
  if (config.headers && !config.headers.Authorization && token) config.headers.Authorization = 'Bearer ' + token
  return config
}

const refreshRequestInterceptor = (config: AxiosRequestConfig) => {
  const token = Cookies.get('refresh')
  if (config.headers && !config.headers.Authorization && token) config.headers.Authorization = 'Bearer ' + token
  return config
}

const errorInterceptor = async (error: AxiosError) => {
  if (error.response) {
    if (error.response.data.message) {
      return Promise.reject(new ApiError(error, `${error.response.status}: ${error.response.data.message}`))
    } else {
      console.log('请点开以下错误（如果存在response字段则将其一并点开，反正能点开多少点多少），并将错误信息截图')
      console.log({ error })
      return Promise.reject(new ApiError(error, `${error.response.status}: 未知错误，请按F12查看控制台以获得错误信息并发至站务分区`))
    }
  } else {
    console.log('请点开以下错误（如果存在response字段则将其一并点开，反正能点开多少点多少），并将错误信息截图')
    console.log({ error })
    return Promise.reject(new ApiError(error, '未知axios错误，请按F12查看控制台以获得错误信息并发至站务分区，'))
  }
}

axios.defaults.baseURL = config.backEndUrl
axios.interceptors.request.use(requestInterceptor)
axios.interceptors.response.use((response) => response, errorInterceptor)
authAxios.defaults.baseURL = config.authUrl
authAxios.interceptors.request.use(requestInterceptor)
authAxios.interceptors.response.use((response) => response, errorInterceptor)
refreshAxios.defaults.baseURL = config.authUrl
refreshAxios.interceptors.request.use(refreshRequestInterceptor)
refreshAxios.interceptors.response.use((response) => response, errorInterceptor)

// Auth-related apis.

export const login = async (email: string, password: string): Promise<{ message: string; access: string; refresh: string }> => {
  const response = await authAxios.post('/login', {
    email: email,
    password: password
  })
  LocalStorageStore.setToken(response.data.access)
  LocalStorageStore.setRefreshToken(response.data.refresh)
  return camelizeKeys(response.data)
}

export const logout = async (): Promise<{ message: string }> => {
  const response = await authAxios.get('/logout')
  return camelizeKeys(response.data)
}

export const refresh = async (): Promise<{ message: string; access: string; refresh: string }> => {
  const response = await refreshAxios.post('/refresh')
  LocalStorageStore.setToken(response.data.access)
  LocalStorageStore.setRefreshToken(response.data.refresh)
  return camelizeKeys(response.data)
}

export const verifyWithEmail = async (email: string): Promise<{ message: string; scope: string }> => {
  const response = await authAxios.get('/verify/email', {
    params: {
      email: email
    }
  })
  return camelizeKeys(response.data)
}

export const register = async (password: string, email: string, verification: string): Promise<{ message: string; access?: string; refresh?: string }> => {
  const response = await authAxios.post('/register', {
    password: password,
    email: email,
    verification: verification
  })
  LocalStorageStore.setToken(response.data.access)
  LocalStorageStore.setRefreshToken(response.data.refresh)
  return camelizeKeys(response.data)
}

export const changePassword = async (password: string, email: string, verification: string): Promise<{ message: string; access?: string; refresh?: string }> => {
  const response = await authAxios.put('/register', {
    password: password,
    email: email,
    verification: verification
  })
  LocalStorageStore.setToken(response.data.access)
  LocalStorageStore.setRefreshToken(response.data.refresh)
  return camelizeKeys(response.data)
}

export const listPunishmentsByUser = async (userId: number) => {
  const response = await authAxios.get(`/users/${userId}/punishments`)
  const data: IPunishment[] = camelizeKeys(response.data)
  return data.map((v) => new Punishment(v))
}

export const addPunishment = async (userId: number, reason: string, days: number, scope: string) => {
  const response = await authAxios.post(`/users/${userId}/punishments`, {
    reason: reason,
    days: days,
    scope: scope
  })
  return new Punishment(camelizeKeys(response.data))
}

export const getPunishmentByUser = async (userId: number, id: number) => {
  const response = await authAxios.get(`/users/${userId}/punishments/${id}`)
  return new Punishment(camelizeKeys(response.data))
}

export const getPunishmentById = async (id: number) => {
  const response = await authAxios.get(`/punishments/${id}`)
  return new Punishment(camelizeKeys(response.data))
}

export const listPunishments = async (size: number, offset: number) => {
  const response = await authAxios.get('/punishments', {
    params: {
      size: size,
      offset: offset
    }
  })
  const data: IPunishment[] = camelizeKeys(response.data)
  return data.map((v) => new Punishment(v))
}

export const getCurrentUser = async () => {
  const response = await authAxios.get('/users/me')
  return new UserAuth(camelizeKeys(response.data))
}

export const deleteUser = async (password: string) => {
  await authAxios.delete('/users/me', {
    data: {
      password: password
    }
  })
}

export const getUserById = async (userId: number) => {
  const response = await authAxios.get(`/users/${userId}`)
  return new UserAuth(camelizeKeys(response.data))
}

export const modifyUser = async (userId: number, userData: IUserAuthData) => {
  const response = await authAxios.put(`/users/${userId}`, snakifyKeys(userData))
  return new UserAuth(camelizeKeys(response.data))
}

export const listUsers = async (size: number, offset: number) => {
  const response = await authAxios.get('/users', {
    params: {
      size: size,
      offset: offset
    }
  })
  const data: IUserAuth[] = camelizeKeys(response.data)
  return data.map((v) => new UserAuth(v))
}

export const getUserProfile = async () => {
  const response = await axios.get('/users')
  return new User(camelizeKeys(response.data))
}

// OpenTreeHole-related apis.

export const listDivisions = async () => {
  const response = await axios.get('/divisions')
  const data: IDivision[] = camelizeKeys(response.data)
  return data.map((v) => new Division(v))
}

export const addDivision = async (division: IDivisionAdd) => {
  const response = await axios.post('/divisions', snakifyKeys(division))
  return new Division(camelizeKeys(response.data))
}

export const getDivision = async (id: number) => {
  const response = await axios.get(`/divisions/${id}`)
  return new Division(camelizeKeys(response.data))
}

export const modifyDivision = async (id: number, division: IDivisionModify) => {
  const response = await axios.put(`/divisions/${id}`, snakifyKeys(division))
  return new Division(camelizeKeys(response.data))
}

/**
 * Delete a division
 * @param id
 * @param to - where the holes in deleted division should be moved to
 */
export const deleteDivision = async (id: number, to: number) => {
  await axios.delete(`/divisions/${id}`, {
    data: {
      to: to
    }
  })
}

export const getFloor = async (id: number) => {
  const response = await axios.get(`/floors/${id}`)
  return new DetailedFloor(camelizeKeys(response.data))
}

export const listFloors = async (holeId: number, length: number, startFloor: number) => {
  const response = await axios.get('/floors', {
    params: {
      hole_id: holeId,
      length: length,
      start_floor: startFloor
    }
  })
  const data: IDetailedFloor[] = camelizeKeys(response.data)
  return data.map((v) => new DetailedFloor(v))
}

export const searchFloors = async (s: string, length: number, startFloor: number) => {
  const response = await axios.get('/floors', {
    params: {
      s: s,
      length: length,
      start_floor: startFloor
    }
  })
  const data: IDetailedFloor[] = camelizeKeys(response.data)
  return data.map((v) => new DetailedFloor(v))
}

export const addFloor = async (floor: IFloorData) => {
  const response = await axios.post('/floors', snakifyKeys(floor))
  const data = camelizeKeys(response.data)
  return { message: data.message as string, floor: new DetailedFloor(data.data) }
}

export const modifyFloor = async (floorId: number, content: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    content: content
  })
  return new DetailedFloor(camelizeKeys(response.data))
}

export const addSpecialTag = async (floorId: number, specialTag: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    special_tag: specialTag
  })
  return new DetailedFloor(camelizeKeys(response.data))
}

export const foldFloor = async (floorId: number, foldReason: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    fold: [foldReason]
  })
  return new DetailedFloor(camelizeKeys(response.data))
}

export const modifyFloorAnonyname = async (floorId: number, anonyname: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    anonyname: anonyname
  })
  return new DetailedFloor(camelizeKeys(response.data))
}

/**
 * Like or Unlike a floor.
 * @param floorId
 * @param like - true: like; false: unlike
 */
export const likeFloor = async (floorId: number, like: boolean) => {
  const response = await axios.put(`/floors/${floorId}`, {
    like: like ? 'add' : 'cancel'
  })
  return new DetailedFloor(camelizeKeys(response.data))
}

export const deleteFloor = async (floorId: number, deleteReason?: string) => {
  const response = await axios.delete(`/floors/${floorId}`, {
    data: {
      delete_reason: deleteReason
    }
  })
  return new DetailedFloor(camelizeKeys(response.data))
}

// export const listHolesByDivision = async (divisionId: number, startTime: Date, length: number) => {
//   const response = await axios.get(`/divisions/${divisionId}/holes`, {
//     params: {
//       start_time: startTime,
//       length: length
//     }
//   })
//   const data: IHole[] = camelizeKeys(response.data)
//   return data.map(v => new Hole(v))
// }

export const addHole = async (divisionId: number, content: string, tags: string[] | ITag[]): Promise<{ message: string; hole: Hole }> => {
  const response = await axios.post('/holes', {
    division_id: divisionId,
    content: content,
    tags: tags.length > 0 ? (typeof tags[0] === 'string' ? (tags as string[]).map((v) => ({ name: v })) : tags.map((v) => ({ name: (v as ITag).name }))) : []
  })
  const data = camelizeKeys(response.data)
  return { message: data.message, hole: new Hole(data.data) }
}

export const listHoles = async (divisionId: number, startTime: Date, length: number, tag?: string | ITag) => {
  const response = await axios.get('/holes', {
    params: {
      division_id: divisionId,
      start_time: startTime.toISOString(),
      length: length,
      prefetch_length: 10,
      tag: tag ? (typeof tag === 'string' ? tag : tag.name) : undefined
    }
  })
  const data: IHole[] = camelizeKeys(response.data)
  return data.map((v) => new Hole(v))
}

export const modifyHoleTag = async (id: number, tags: string[] | ITag[]) => {
  const response = await axios.put(`/holes/${id}`, {
    tags: tags.length > 0 ? (typeof tags[0] === 'string' ? (tags as string[]).map((v) => ({ name: v })) : tags.map((v) => ({ name: (v as ITag).name }))) : []
  })
  return new Hole(camelizeKeys(response.data))
}

export const modifyHoleDivision = async (id: number, divisionId: number) => {
  const response = await axios.put(`/holes/${id}`, {
    division_id: divisionId
  })
  return new Hole(camelizeKeys(response.data))
}

export const getHole = async (id: number) => {
  const response = await axios.get(`/holes/${id}`)
  return new Hole(camelizeKeys(response.data))
}

export const updatePageViews = async (id: number) => {
  await axios.patch(`/holes/${id}`)
}

export const listTags = async () => {
  const response = await axios.get('/tags')
  const data: ITag[] = camelizeKeys(response.data)
  return data.map((v) => new Tag(v))
}

export const getTag = async (id: number) => {
  const response = await axios.get(`/tags/${id}`)
  return new Tag(camelizeKeys(response.data))
}

export const addTag = async (name: string) => {
  const response = await axios.post('/tags', {
    name: name
  })
  return new Tag(camelizeKeys(response.data))
}

export const modifyTag = async (id: number, name: string) => {
  const response = await axios.put(`/tags/${id}`, {
    name: name
  })
  return new Tag(camelizeKeys(response.data))
}

export const deleteTag = async (id: number) => {
  await axios.delete(`/tags/${id}`)
}

export const getFavorites = async () => {
  const response = await axios.get('/user/favorites')
  const data: IHole[] = camelizeKeys(response.data)
  return data.map((v) => new Hole(v))
}

export const addFavorites = async (holeId: number): Promise<string> => {
  const response = await axios.post('/user/favorites', {
    hole_id: holeId
  })
  return response.data.message
}

export const modifyFavorites = async (holeIds: number[]): Promise<string> => {
  const response = await axios.post('/user/favorites', {
    hole_ids: holeIds
  })
  return response.data.message
}

export const deleteFavorites = async (holeId: number): Promise<string> => {
  const response = await axios.delete('/user/favorites', {
    data: {
      hole_id: holeId
    }
  })
  return response.data.message
}

export const listReports = async () => {
  const response = await axios.get('/reports?category=not_dealed')
  const data: IReport[] = camelizeKeys(response.data)
  return data.map((v) => new Report(v))
}

export const getReport = async (id: number) => {
  const response = await axios.get(`/reports/${id}`)
  return new Report(camelizeKeys(response.data))
}

export const addReport = async (floorId: number, reason: string) => {
  const response = await axios.post('/reports', {
    floor_id: floorId,
    reason: reason
  })
  return new Report(camelizeKeys(response.data))
}

export const dealReport = async (id: number, deal: IReportDeal): Promise<string> => {
  const response = await axios.post(`/reports/${id}`, snakifyKeys(deal))
  return response.data.message
}

export const addPenalty = async (floorId: number, penaltyLevel: number, divisionId: number) => {
  const response = await axios.post(`/penalty/${floorId}`, {
    penalty_level: penaltyLevel,
    division_id: divisionId
  })
  return new User(camelizeKeys(response.data))
}

export const uploadImage = async (imageBase64: string): Promise<{ message: string; url: string; medium: string; thumb: string }> => {
  const response = await axios.post('/images', {
    image: imageBase64
  })
  return camelizeKeys(response.data)
}

export default axios
