// noinspection DuplicatedCode

import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { router } from '@/router'
import { camelizeKeys, snakifyKeys } from '@/utils'
import JWTManager from '@/apis/jwt'
import Cookies from 'js-cookie'
import config from '@/config'
import { factory as originalFactory, arrayFactory as originalArrayFactory } from '@/utils/reflect'
import {
  Punishment,
  UserAuth,
  User,
  Division,
  UserAuthData,
  IDivisionAdd,
  DetailedFloor,
  IFloorData,
  Hole,
  Tag,
  Report,
  IDivisionModify,
  FloorHistory
} from '@/types'

const factory = <T>(TargetClass: new () => T, data: any, meta?: any): T => {
  return originalFactory(TargetClass, camelizeKeys(data), meta)
}

const arrayFactory = <T>(TargetClass: new () => T, data: any[], meta?: any): T[] => {
  return originalArrayFactory(TargetClass, camelizeKeys(data), meta)
}

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

const jwt = new JWTManager(async () => (await refresh()).access)
jwt.refreshErrorCallback = async (refreshError: AxiosError<any, any>) => {
  if (refreshError.response?.status === 401) {
    Cookies.remove('access', { domain: config.cookieDomain, expires: 10 })
    Cookies.remove('refresh', { domain: config.cookieDomain, expires: 10 })
    if (router.currentRoute.value.name !== 'login') {
      await router.replace({
        name: 'login'
      })
      if (refreshError.response?.data.message)
        return Promise.reject(
          new ApiError(
            refreshError,
            `${refreshError.response.status}: ${refreshError.response.data.message}`
          )
        )
      else return Promise.reject(new ApiError(refreshError, '会话已过期，请重新登录'))
    }
  }
}
axios.interceptors.response.use((response) => response, jwt.responseErrorInterceptor)
authAxios.interceptors.response.use((response) => response, jwt.responseErrorInterceptor)

const requestInterceptor = (config: AxiosRequestConfig) => {
  const token = Cookies.get('access')
  if (config.headers && !config.headers.Authorization && token)
    config.headers.Authorization = 'Bearer ' + token
  return config
}

const refreshRequestInterceptor = (config: AxiosRequestConfig) => {
  const token = Cookies.get('refresh')
  if (config.headers && !config.headers.Authorization && token)
    config.headers.Authorization = 'Bearer ' + token
  return config
}

const errorInterceptor = async (error: AxiosError<any, any>) => {
  if (error instanceof ApiError) return Promise.reject(error)
  if (error.response?.data?.message) {
    return Promise.reject(
      new ApiError(error, `${error.response.status}: ${error.response.data.message}`)
    )
  } else {
    console.log('请点开以下错误（如果存在 response 字段则将其一并点开），并将错误信息截图')
    console.log({ error })
    const prefix = error.response?.status ? `${error.response.status}: ` : ''
    return Promise.reject(
      new ApiError(error, `${prefix}未知错误，请按 F12 查看控制台以获得错误信息并发至站务分区`)
    )
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

export const login = async (
  email: string,
  password: string
): Promise<{ message: string; access: string; refresh: string }> => {
  const response = await authAxios.post('/login', {
    email: email,
    password: password
  })
  Cookies.set('access', response.data.access, { domain: config.cookieDomain, expires: 10 })
  Cookies.set('refresh', response.data.refresh, { domain: config.cookieDomain, expires: 10 })
  return camelizeKeys(response.data)
}

export const logout = async (): Promise<{ message: string }> => {
  const response = await authAxios.get('/logout')
  return camelizeKeys(response.data)
}

export const refresh = async (): Promise<{ message: string; access: string; refresh: string }> => {
  const response = await refreshAxios.post('/refresh')
  Cookies.set('access', response.data.access, { domain: config.cookieDomain, expires: 10 })
  Cookies.set('refresh', response.data.refresh, { domain: config.cookieDomain, expires: 10 })
  return camelizeKeys(response.data)
}

export const verifyWithEmail = async (
  email: string
): Promise<{ message: string; scope: string }> => {
  const response = await authAxios.get('/verify/email', {
    params: {
      email: email
    }
  })
  return camelizeKeys(response.data)
}

export const register = async (
  password: string,
  email: string,
  verification: string
): Promise<{ message: string; access?: string; refresh?: string }> => {
  const response = await authAxios.post('/register', {
    password: password,
    email: email,
    verification: verification
  })
  Cookies.set('access', response.data.access, { domain: config.cookieDomain, expires: 10 })
  Cookies.set('refresh', response.data.refresh, { domain: config.cookieDomain, expires: 10 })
  return camelizeKeys(response.data)
}

export const changePassword = async (
  password: string,
  email: string,
  verification: string
): Promise<{ message: string; access?: string; refresh?: string }> => {
  const response = await authAxios.put('/register', {
    password: password,
    email: email,
    verification: verification
  })
  Cookies.set('access', response.data.access, { domain: config.cookieDomain, expires: 10 })
  Cookies.set('refresh', response.data.refresh, { domain: config.cookieDomain, expires: 10 })
  return camelizeKeys(response.data)
}

export const listPunishmentsByUser = async (userId: number) => {
  const response = await authAxios.get(`/users/${userId}/punishments`)
  return arrayFactory(Punishment, response.data)
}

export const addPunishment = async (
  userId: number,
  reason: string,
  days: number,
  scope: string
) => {
  const response = await authAxios.post(`/users/${userId}/punishments`, {
    reason: reason,
    days: days,
    scope: scope
  })
  return factory(Punishment, response.data)
}

export const getPunishmentByUser = async (userId: number, id: number) => {
  const response = await authAxios.get(`/users/${userId}/punishments/${id}`)
  return factory(Punishment, response.data)
}

export const getPunishmentById = async (id: number) => {
  const response = await authAxios.get(`/punishments/${id}`)
  return factory(Punishment, response.data)
}

export const listPunishments = async (size: number, offset: number) => {
  const response = await authAxios.get('/punishments', {
    params: {
      size: size,
      offset: offset
    }
  })
  return arrayFactory(Punishment, response.data)
}

export const getCurrentUser = async () => {
  const response = await authAxios.get('/users/me')
  return factory(UserAuth, response.data)
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
  return factory(UserAuth, response.data)
}

export const modifyUser = async (userId: number, userData: UserAuthData) => {
  const response = await authAxios.put(`/users/${userId}`, snakifyKeys(userData))
  return factory(UserAuth, response.data)
}

export const listUsers = async (size: number, offset: number) => {
  const response = await authAxios.get('/users', {
    params: {
      size: size,
      offset: offset
    }
  })
  return arrayFactory(UserAuth, response.data)
}

export const getUserProfile = async () => {
  const response = await axios.get('/users')
  return factory(User, response.data)
}

// OpenTreeHole-related apis.

export const listDivisions = async () => {
  const response = await axios.get('/divisions')
  return arrayFactory(Division, response.data)
}

export const addDivision = async (division: IDivisionAdd) => {
  const response = await axios.post('/divisions', snakifyKeys(division))
  return factory(Division, response.data)
}

export const getDivision = async (id: number) => {
  const response = await axios.get(`/divisions/${id}`)
  return factory(Division, response.data)
}

export const modifyDivision = async (id: number, division: IDivisionModify) => {
  const response = await axios.put(`/divisions/${id}`, snakifyKeys(division))
  return factory(Division, response.data)
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
  return factory(DetailedFloor, response.data)
}

export const listFloors = async (holeId: number, length: number, startFloor: number) => {
  const response = await axios.get('/floors', {
    params: {
      hole_id: holeId,
      length: length,
      start_floor: startFloor
    }
  })
  return arrayFactory(DetailedFloor, response.data)
}

export const searchFloors = async (s: string, length: number, startFloor: number) => {
  const response = await axios.get('/floors', {
    params: {
      s: s,
      length: length,
      start_floor: startFloor
    }
  })
  return arrayFactory(DetailedFloor, response.data)
}

export const addFloor = async (holeId: number, floor: IFloorData) => {
  const response = await axios.post(`/holes/${holeId}/floors`, snakifyKeys(floor))
  return factory(DetailedFloor, response.data)
}

export const modifyFloor = async (floorId: number, content: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    content: content
  })
  return factory(DetailedFloor, response.data)
}

export const addSpecialTag = async (floorId: number, specialTag: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    special_tag: specialTag
  })
  return factory(DetailedFloor, response.data)
}

export const foldFloor = async (floorId: number, foldReason: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    fold: [],
    fold_v2: foldReason
  })
  return factory(DetailedFloor, response.data)
}

export const modifyFloorAnonyname = async (floorId: number, anonyname: string) => {
  const response = await axios.put(`/floors/${floorId}`, {
    anonyname: anonyname
  })
  return factory(DetailedFloor, response.data)
}

/**
 * Like or Unlike a floor.
 * @param floorId
 * @param like - 1 for like, 0 for reset, -1 for dislike
 */
export const likeFloor = async (floorId: number, like: number) => {
  const response = await axios.post(`/floors/${floorId}/like/${like}`)
  return factory(DetailedFloor, response.data)
}

export const deleteFloor = async (floorId: number, deleteReason?: string) => {
  const response = await axios.delete(`/floors/${floorId}`, {
    data: {
      delete_reason: deleteReason
    }
  })
  return factory(DetailedFloor, response.data)
}

export const getFloorHistory = async (floorId: number) => {
  const response = await axios.get(`/floors/${floorId}/history`)
  return arrayFactory(FloorHistory, response.data)
}

export const restoreFloorFromHistory = async (
  floorId: number,
  historyId: number,
  reason?: string
) => {
  const response = await axios.post(`/floors/${floorId}/restore/${historyId}`, {
    restore_reason: reason
  })
  return factory(DetailedFloor, response.data)
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

export const addHole = async (
  divisionId: number,
  content: string,
  tags: string[] | Tag[],
  specialTag?: string
): Promise<{ message: string; hole: Hole }> => {
  const response = await axios.post('/holes', {
    division_id: divisionId,
    content: content,
    tags:
      tags.length > 0
        ? typeof tags[0] === 'string'
          ? (tags as string[]).map((v) => ({ name: v }))
          : tags.map((v) => ({ name: (v as Tag).name }))
        : [],
    special_tag: specialTag
  })
  const data = camelizeKeys(response.data)
  return { message: data.message, hole: factory(Hole, data.data) }
}

export const listHoles = async (
  divisionId: number,
  startTime: Date,
  length: number,
  tag?: string | Tag
) => {
  const response = await axios.get('/holes', {
    params: {
      division_id: divisionId,
      start_time: startTime.toISOString(),
      length: length,
      prefetch_length: 10,
      tag: tag ? (typeof tag === 'string' ? tag : tag.name) : undefined
    }
  })
  return arrayFactory(Hole, response.data)
}

export const modifyHoleTag = async (id: number, tags: string[] | Tag[]) => {
  const response = await axios.put(`/holes/${id}`, {
    tags:
      tags.length > 0
        ? typeof tags[0] === 'string'
          ? (tags as string[]).map((v) => ({ name: v }))
          : tags.map((v) => ({ name: (v as Tag).name }))
        : []
  })
  return factory(Hole, response.data)
}

export const modifyHoleDivision = async (id: number, divisionId: number) => {
  console.log(divisionId)
  const response = await axios.put(`/holes/${id}`, {
    division_id: divisionId
  })
  return factory(Hole, response.data)
}

export const modifyHoleHidden = async (id: number, hidden: boolean) => {
  const response = await axios.put(`/holes/${id}`, {
    unhidden: !hidden
  })
  return factory(Hole, response.data)
}

export const getHole = async (id: number) => {
  const response = await axios.get(`/holes/${id}`)
  return factory(Hole, response.data)
}

export const updatePageViews = async (id: number) => {
  await axios.patch(`/holes/${id}`)
}

export const listTags = async () => {
  const response = await axios.get('/tags')
  return arrayFactory(Tag, response.data)
}

export const getTag = async (id: number) => {
  const response = await axios.get(`/tags/${id}`)
  return factory(Tag, response.data)
}

export const addTag = async (name: string) => {
  const response = await axios.post('/tags', {
    name: name
  })
  return factory(Tag, response.data)
}

export const modifyTag = async (id: number, name: string) => {
  const response = await axios.put(`/tags/${id}`, {
    name: name
  })
  return factory(Tag, response.data)
}

export const deleteTag = async (id: number) => {
  await axios.delete(`/tags/${id}`)
}

export const getFavorites = async () => {
  const response = await axios.get('/user/favorites')
  return arrayFactory(Hole, response.data)
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

export const listReports = async (
  offset: number,
  size: number,
  range: number,
  orderedBy?: string,
  sort?: string
) => {
  const response = await axios.get('/reports', {
    params: {
      offset,
      size,
      range,
      ordered_by: orderedBy,
      sort
    }
  })
  return arrayFactory(Report, response.data)
}

export const getReport = async (id: number) => {
  const response = await axios.get(`/reports/${id}`)
  return factory(Report, response.data)
}

export const addReport = async (floorId: number, reason: string) => {
  await axios.post('/reports', {
    floor_id: floorId,
    reason: reason
  })
}

export const dealReport = async (id: number, result: string) => {
  const response = await axios.delete(`/reports/${id}`, {
    data: {
      result
    }
  })
  return factory(Report, response.data)
}

export const addPenalty = async (floorId: number, penaltyLevel: number, divisionId: number) => {
  const response = await axios.post(`/penalty/${floorId}`, {
    penalty_level: penaltyLevel,
    division_id: divisionId
  })
  return factory(User, response.data)
}

export const uploadImage = async (
  imageBase64: string
): Promise<{ message: string; url: string; medium: string; thumb: string }> => {
  const response = await axios.post('/images', {
    image: imageBase64
  })
  return camelizeKeys(response.data)
}

export const testError = async () => {
  await axios.get('/not_exist')
}

export default axios
