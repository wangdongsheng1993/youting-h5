// 响应类型
export interface RespListenVO {
  code: number
  message: string
  status: number
  data: ListenVO | null
  v: string
  errorData: ErrorData | null
  success: boolean
}

export interface ErrorData {
  code: string
  message: string
  data: object
}

export interface ListenVO {
  id: number
  userId: number
  groupId: number
  groupOrder: number
  title: string
  cainaLookId: number
  cainaUserId: number
  pic: string
  intro: string
  filePath: string
  isNeedPay: number
  duration: number
  fileSize: number
  isRecommend: number
  hotValue: number
  listenNum: number
  createTime: string
  status: number
  auditState: number
  goodCount: number
  commentCount: number
  favCount: number
  adCount: number
  helpGoldCount: number
  user: UserSimple | null
  tagList: string[]
  isFav: number
  isGood: number
  isFollow: number
  cainaLook: CarouselImage | null
}

export interface UserSimple {
  id: number
  code: string
  subUserCount: string
  fansUserCount: string
  goodCount: string
  nickName: string
  sex: string
  imagePath: string
  isAuthor: number
  nickNameType: number
  imageType: number
  vipType: number
  chatStyle: number
  lampList: LampInfo[]
  createTime: string
}

export interface LampInfo {
  authorId: number
  buyVipType: number
  name: string
  imagePath: string
}

export interface CarouselImage {
  id: number
  title: string
  pic: string
  intro: string
  isNeedPay: number
  isRecommend: number
  hotValue: number
  lookRead: number
  accessCount: number
  reviewRemark: string
  createTime: string
  isDraft: number
  auditState: number
  goodCount: number
  commentCount: number
  favCount: number
  adCount: number
  helpGoldCount: number
  status: number
  user: UserSimple | null
  lookContent: LookContent | null
  isFav: number
  isGood: number
  isCaina: number
  isFollow: number
  tagList: string[]
}

export interface LookContent {
  id: number
  content: string
  newContent: string
}
