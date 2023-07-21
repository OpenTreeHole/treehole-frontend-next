import { arrayFactory, factory, Field, Model } from '@/utils/reflect'
import { generateColor } from '@/utils'

export interface IFloorData {
  content: string
  replyTo?: number
  specialTag?: string
}

@Model
export class Floor {
  isDetailed: boolean

  @Field()
  content: string

  @Field()
  holeId: number

  @Field()
  specialTag: string

  @Field()
  anonyname: string

  @Field()
  deleted: boolean

  @Field()
  id: number

  @Field({ factory: (v, parent) => parent.foldV2 })
  fold: string

  @Field()
  like: number

  @Field({ type: Date })
  timeCreated: Date

  @Field({ type: Date })
  timeUpdated: Date

  constructor() {
    this.isDetailed = false
  }
}

@Model
export class DetailedFloor extends Floor {
  @Field()
  isMe?: boolean

  @Field()
  liked?: boolean

  @Field({ type: Floor, array: true })
  mention: Floor[]

  constructor() {
    super()
    this.isDetailed = true
  }
}

@Model
export class Tag {
  @Field()
  name: string

  @Field()
  tagId: number

  @Field()
  temperature: number

  @Field({ factory: (v, parent) => generateColor(parent.name) })
  color: string

  constructor(name?: string) {
    if (!name) return
    this.name = name
    this.tagId = 0
    this.temperature = 0
    this.color = generateColor(name)
  }
}

@Model
export class Hole {
  @Field()
  divisionId: number

  @Field()
  id: number

  @Field()
  hidden: boolean

  @Field({ factory: (v) => arrayFactory(Floor, v.prefetch) })
  floors: Floor[]

  @Field({ factory: () => 0 })
  floorLoaded: number

  @Field({ factory: (v, parent) => factory(Floor, parent.floors.firstFloor) })
  firstFloor: Floor

  @Field({ factory: (v, parent) => factory(Floor, parent.floors.lastFloor) })
  lastFloor: Floor

  @Field()
  reply: number

  @Field({ type: Tag, array: true })
  tags: Tag[]

  @Field({ type: Date })
  timeCreated: Date

  @Field({ type: Date })
  timeUpdated: Date
}

@Model
export class Report {
  @Field()
  dealt: boolean

  @Field()
  dealtBy: number

  @Field({ type: Floor })
  floor: Floor

  @Field()
  reason: string

  @Field()
  id: number

  @Field()
  result: string

  @Field({ type: Date })
  timeCreated: Date

  @Field({ type: Date })
  timeUpdated: Date
}

export interface IReportDeal {
  fold?: string[]
  delete?: string
  silent?: number
  notDeal?: boolean
}

export interface IDivisionAdd {
  description: string
  name: string
}

export interface IDivisionModify {
  description?: string
  name?: string
  pinned?: number[]
}

@Model
export class Division {
  @Field()
  id: number

  @Field()
  description: string

  @Field()
  name: string

  @Field({ type: Hole, array: true })
  pinned: Hole[]
}

export class Punishment {
  @Field()
  id: number

  @Field()
  madeBy: { id: number }

  @Field()
  reason: string

  @Field()
  scope: string

  @Field()
  user: { id: number }

  @Field({ type: Date })
  startTime: Date

  @Field({ type: Date })
  endTime: Date
}

// @Model
// export class Permission {
//   @Field({ type: Date })
//   admin: Date

//   @Field({ type: Date, map: true })
//   silent: Record<string, Date>
// }

@Model
export class User {
  @Field()
  userId: number

  @Field()
  config: { notify: string[]; showFolded: boolean }

  @Field()
  favorites: number[]

  @Field()
  isAdmin: boolean

  @Field()
  nickname: string

  // @Field({ type: Permission })
  // permission: Permission

  @Field({ type: Date })
  joinedTime: Date
}

export interface UserAuthData {
  silent: any
  nickname: string
  offenseCount: number
  isAdmin: boolean
}

@Model
export class UserAuth {
  @Field()
  id: number

  @Field()
  nickname: string

  @Field({ type: Date })
  joinedTime: Date

  @Field({ type: Date })
  lastLogin: Date

  @Field()
  isAdmin: boolean
}

@Model
export class FloorHistory {
  @Field()
  id: number

  @Field()
  content: string

  @Field()
  floorId: number

  @Field()
  reason: string

  @Field()
  userId: number

  @Field({ type: Date })
  timeCreated: Date

  @Field({ type: Date })
  timeUpdated: Date
}
