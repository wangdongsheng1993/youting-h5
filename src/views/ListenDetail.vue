<template>
  <div class="listen-detail">
    <div v-if="loading && !detail" class="state-block">
      <div class="loading-spinner"></div>
      <span>页面加载中...</span>
    </div>
    <div v-else-if="detail" class="screen">
      <div class="status-bar">

      </div>

      <header class="top-bar">

        <div class="author-pill">
          <img v-if="avatarSource" :src="avatarSource" alt="avatar" class="author-avatar" />
          <div v-else class="author-avatar author-avatar-fallback">{{ displayName.slice(0, 1) }}</div>
          <span class="author-name">{{ displayName }}</span>
        </div>

        <div class="top-bar-actions">
          <div class="vip-chip">
            <img :src="diamondImg" alt="vip" class="chip-icon" />
            <span>开通会员，为Ta助力</span>
          </div>

          <button
            class="follow-btn"
            :class="{ followed: detail.isFollow === 0 }"
            type="button"
            @click="toggleFollow"
          >
            {{ detail.isFollow === 0 ? '已关注' : '关注' }}
          </button>

          <button class="circle-btn icon-only" type="button">
            <img :src="favoriteImg" alt="favorite" class="icon-img" />
          </button>
        </div>
      </header>

      <main class="content">
        <div class="cover-card">
          <div class="cover-shadow"></div>
          <img :src="coverSource" :alt="detail.title" class="cover-image" />
        </div>

        <section class="title-section">
          <div class="title-row">
            <h1 class="audio-title">{{ detail.title }}</h1>
            <div class="headline-actions">
              <button class="metric-button" type="button" @click="toggleLike">
                <img :src="like1Img" alt="like" class="icon-img" :class="{ active: detail.isGood === 1 }" />
                <span>{{ formatCount(detail.goodCount) }}</span>
              </button>
              <button class="metric-button" type="button" @click="toggleFav">
                <img :src="shoucangImg" alt="favorite" class="icon-img" :class="{ active: detail.isFav === 1 }" />
                <span>{{ formatCount(detail.favCount) }}</span>
              </button>
              <button class="metric-button bullet-button" type="button">
                <img :src="danImg" alt="favorite" class="icon-img" :class="{ active: detail.isBullet === 1 }" />
                <span>{{ formatCount(detail.commentCount || 89) }}</span>
              </button>
            </div>
          </div>

          <div class="meta-row">
            <span class="breadcrumb">{{ detail.cainaLook?.title || '通往异世界大门' }} ></span>
            <span class="subscribe-tag">订阅</span>
          </div>
        </section>

        <section class="progress-section">
          <div class="progress-row">
            <img :src="rewindChipImg" alt="favorite" class="rewind-chip" @click="skip(-15)" />
            <div class="progress-main">
              <div class="trial-pill-wrap" :style="{ left: `${trialProgress}%` }">
                <div class="trial-pill">
                  试听30%，收听完整版请充值或补充广告币
                </div>
              </div>
              <button class="progress-bar" type="button" @click="seek">
                <span class="progress-track">
                  <span class="progress-fill" :style="{ width: `${progress}%` }"></span>
                  <span class="progress-thumb" :style="{ left: `${progress}%` }"></span>
                  <span class="trial-thumb" :style="{ left: `${trialProgress}%` }"></span>
                </span>
              </button>
              <div class="time-row">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(totalDuration) }}</span>
              </div>
            </div>
            <img :src="rewindChip1Img" alt="favorite" class="rewind-chip" @click="skip(-15)" />
          </div>
        </section>

        <section class="player-controls">

          <button class="control-btn side-control align-right" type="button">
            <img :src="playIconImg" alt="favorite" class="control-btn side-control" />
            <span>连播</span>
          </button>
          <img :src="1 === 1 ? backImg : back1Img" alt="favorite" class="control-btn previous-btn" />
          <img
            :src="isPlaying ? follow1Img : followImg"
            alt="favorite"
            class="play-button"
            @click="togglePlay"
          />
          <img :src="1 === 1 ? moreImg : more1Img" alt="favorite" class="control-btn next-btn" />


          <button class="control-btn side-control align-right" type="button">
            <img :src="plusImg" alt="favorite" class="control-btn side-control" />
            <span>{{ `${episodeLabel}期` }}</span>
          </button>
        </section>

        <section class="reward-board">
          <div class="reward-header">
            <div class="reward-title">打赏榜单</div>
            <button class="more-btn" type="button">
              更多
              <img :src="arrowRightImg" alt="favorite" class="more-arrow" />
            </button>
          </div>
          <div class="reward-list">
            <div v-for="user in rewardUsers" :key="user.name + user.badge" class="reward-card">
              <div class="reward-avatar-shell" :style="{ '--accent': user.accent }">
                <img v-if="user.image" :src="user.image" :alt="user.name" class="reward-avatar" />
                <div v-else class="reward-avatar reward-fallback">{{ user.name.slice(0, 1) }}</div>
                <img v-if="user.badge === '1' || user.badge === '2' || user.badge === '3'" :src="user.badge === '1' ? crownSilverImg : user.badge === '2' ? crownSilver1Img : user.badge === '3' ? crownSilver2Img : ''" :alt="user.name" class="reward-badge" />
              </div>
            </div>
          </div>
        </section>

        <section class="comment-board">
          <div class="comment-header">
            <button class="comment-collapse" type="button">
              <img :src="minusImg" alt="collapse" class="collapse-icon" />
            </button>
            <h2 class="comment-title">评论 ({{ commentTotal }})</h2>
            <div class="comment-tabs">
              <button
                v-for="tab in commentTabs"
                :key="tab.key"
                class="comment-tab"
                :class="{ active: currentCommentTab === tab.key }"
                type="button"
                @click="currentCommentTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="comment-list">
            <article v-for="comment in displayedComments" :key="comment.id" class="comment-item">
              <div class="comment-main">
                <div class="comment-user">
                  <img
                    v-if="comment.avatar"
                    :src="comment.avatar"
                    :alt="comment.author"
                    class="comment-avatar"
                  />
                  <div
                    v-else
                    class="comment-avatar comment-avatar-fallback"
                    :style="{ '--avatar-accent': comment.avatarAccent }"
                  >
                    {{ comment.author.slice(0, 1) }}
                  </div>
                  <div class="comment-meta">
                    <div class="comment-name">{{ comment.author }}</div>
                    <div class="comment-time">{{ comment.time }}</div>
                  </div>
                </div>

                <div class="comment-like" type="button">
                  <img :src="comment.liked ? likeImg : like1Img" alt="like" class="icon-img comment-like-icon" />
                  <span>{{ comment.likes }}</span>
                </div>
              </div>

              <div class="comment-content">{{ comment.content }}</div>

              <button
                v-if="comment.replyCount"
                class="reply-expand"
                type="button"
              >
                一展开 {{ comment.replyCount }} 条回复
                <img :src="arrowRightImg" alt="expand" class="reply-arrow" />
              </button>

              <div v-if="comment.replyPreview" class="reply-preview">
                <div class="reply-author">{{ comment.replyPreview.author }}</div>
                <div class="reply-text">{{ comment.replyPreview.content }}</div>
                <div class="reply-time">{{ comment.replyPreview.time }}</div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <div class="comment-composer">
        <div class="locked-tip-pill">收听完整版，请下载有听故事网</div>
      </div>

      <audio
        ref="audioRef"
        :src="detail.filePath"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="onEnded"
      ></audio>
    </div>

    <div v-else class="state-block state-error">
      <span>{{ error || '页面加载失败' }}</span>
      <button class="retry-btn" type="button" @click="fetchData">重新加载</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getListenDetail } from '../api/listen'
import type { ListenVO } from '../types'
import backImg from '../assets/images/back.png'
import back1Img from '../assets/images/back-1.png'
import followImg from '../assets/images/follow.png'
import follow1Img from '../assets/images/follow-1.png'
import plusImg from '../assets/images/plus.png'
import moreImg from '../assets/images/more.png'
import more1Img from '../assets/images/more-1.png'
import danImg from '../assets/images/dan.png'
import shoucangImg from '../assets/images/shoucang.png'
import favoriteImg from '../assets/images/favorite.png'
import playIconImg from '../assets/images/play-icon.png'
import diamondImg from '../assets/images/diamond.png'
import rewindChipImg from '../assets/images/rewind-chip.png'
import rewindChip1Img from '../assets/images/rewind-chip-1.png'
import arrowRightImg from '../assets/images/icon-arrow-right.png'
import crownSilverImg from '../assets/images/crown-silver.png'
import crownSilver1Img from '../assets/images/crown-silver-1.png'
import crownSilver2Img from '../assets/images/crown-silver-2.png'
import minusImg from '../assets/images/minus.png'
import likeImg from '../assets/images/like.png'
import like1Img from '../assets/images/like-1.png'

const route = useRoute()
const audioRef = ref<HTMLAudioElement | null>(null)
const loading = ref(true)
const error = ref('')
const detail = ref<ListenVO | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)
const currentCommentTab = ref<'latest' | 'hottest'>('latest')
const trialProgress = 30

const createMockDetail = (): ListenVO => ({
  id: 1309,
  userId: 47,
  groupId: 21,
  groupOrder: 21,
  title: '通往异世界大门之原始之门',
  cainaLookId: 0,
  cainaUserId: 0,
  pic: '/image.png',
  intro: '沉浸式有声体验',
  filePath: '',
  isNeedPay: 1,
  duration: 3373,
  fileSize: 0,
  isRecommend: 1,
  hotValue: 0,
  listenNum: 0,
  createTime: '2026-03-30T09:41:00',
  status: 1,
  auditState: 1,
  goodCount: 178,
  commentCount: 89,
  favCount: 89,
  adCount: 326,
  helpGoldCount: 89,
  user: {
    id: 47,
    code: '',
    subUserCount: '0',
    fansUserCount: '178',
    goodCount: '89',
    nickName: '吃菠菜的鱼儿',
    sex: '0',
    imagePath: '',
    isAuthor: 1,
    nickNameType: 0,
    imageType: 0,
    vipType: 1,
    chatStyle: 0,
    lampList: [],
    createTime: '2026-03-30T09:41:00'
  },
  tagList: ['订阅'],
  isFav: 0,
  isGood: 0,
  isFollow: 0,
  cainaLook: {
    id: 1,
    title: '通往异世界大门',
    pic: '',
    intro: '',
    isNeedPay: 0,
    isRecommend: 0,
    hotValue: 0,
    lookRead: 0,
    accessCount: 0,
    reviewRemark: '',
    createTime: '2026-03-30T09:41:00',
    isDraft: 0,
    auditState: 1,
    goodCount: 0,
    commentCount: 0,
    favCount: 0,
    adCount: 0,
    helpGoldCount: 0,
    status: 1,
    user: null,
    lookContent: null,
    isFav: 0,
    isGood: 0,
    isCaina: 0,
    isFollow: 0,
    tagList: []
  }
})

const totalDuration = computed(() => Math.floor(audioDuration.value || detail.value?.duration || 0))
const trialDuration = computed(() => Math.floor((totalDuration.value * trialProgress) / 100))
const progress = computed(() => {
  if (!totalDuration.value) {
    return 0
  }
  return Math.min((currentTime.value / totalDuration.value) * 100, 100)
})

const displayName = computed(() => detail.value?.user?.nickName || '吃菠菜的鱼儿')
const avatarSource = computed(() => detail.value?.user?.imagePath || '')
const coverSource = computed(() => detail.value?.pic || '/image.png')
const episodeLabel = computed(() => detail.value?.groupOrder || detail.value?.groupId || 21)

const rewardUsers = computed(() => {
  const current = detail.value
  const primaryImage = current?.user?.imagePath || ''

  return [
    { name: '暖暖', image: primaryImage, badge: '1', accent: '#f3c152' },
    { name: '阿泽', image: '', badge: '2', accent: '#84d8ff' },
    { name: '听友', image: '', badge: '3', accent: '#ffad66' },
    { name: '小北', image: '', badge: '4', accent: '#8bd7c5' }
  ]
})

const commentTabs = [
  { key: 'latest', label: '最新' },
  { key: 'hottest', label: '最热' }
] as const

const commentTotal = computed(() => detail.value?.commentCount || 8)

const commentList = computed(() => {
  const primaryAvatar = detail.value?.user?.imagePath || ''

  return [
    {
      id: 1,
      author: '吃菠菜的鱼哥',
      avatar: primaryAvatar,
      avatarAccent: '#5dd8ce',
      time: '49分钟前',
      content: '通往异世界大门之原始之门的开局第一章有点难懂，难道是我太笨？...',
      likes: 307,
      liked: true,
      replyCount: 1,
      replyPreview: undefined
    },
    {
      id: 2,
      author: '我不是白菜',
      avatar: '/9d81bfda-743b-4116-983b-1512716905fa.png',
      avatarAccent: '#72b5ff',
      time: '16:59',
      content: '运筹帷幄之中，决胜千里之外！~',
      likes: 178,
      liked: false,
      replyCount: 0,
      replyPreview: {
        author: '吃菠菜的鱼哥',
        content: '我叫约瑟天：这句话是什么意思？我没有太明白呢，请你给我解释解释',
        time: '17:36'
      }
    },
    {
      id: 3,
      author: '吃菠菜的鱼哥',
      avatar: primaryAvatar,
      avatarAccent: '#5dd8ce',
      time: '16:40',
      content: '一整个无语住',
      likes: 13,
      liked: false,
      replyCount: 0,
      replyPreview: undefined
    }
  ]
})

const displayedComments = computed(() => {
  if (currentCommentTab.value === 'latest') {
    return commentList.value
  }

  return [...commentList.value].sort((a, b) => b.likes - a.likes)
})

const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    const id = Number(route.params.id) || 1309
    const response = await getListenDetail(id)

    if (response.success && response.data) {
      detail.value = response.data
      return
    }

    detail.value = createMockDetail()
    error.value = response.message || '已展示设计稿预览数据'
  } catch (requestError) {
    detail.value = createMockDetail()
    error.value = requestError instanceof Error ? requestError.message : '已展示设计稿预览数据'
  } finally {
    loading.value = false
  }
}

const togglePlay = async () => {
  if (!audioRef.value || !detail.value?.filePath) {
    isPlaying.value = !isPlaying.value
    return
  }

  if (trialDuration.value && audioRef.value.currentTime >= trialDuration.value) {
    audioRef.value.currentTime = trialDuration.value
    currentTime.value = trialDuration.value
    isPlaying.value = false
    return
  }

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  try {
    await audioRef.value.play()
    isPlaying.value = true
  } catch {
    isPlaying.value = false
  }
}

const onTimeUpdate = () => {
  if (!audioRef.value) {
    return
  }

  if (trialDuration.value && audioRef.value.currentTime >= trialDuration.value) {
    audioRef.value.currentTime = trialDuration.value
    currentTime.value = trialDuration.value
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  currentTime.value = Math.floor(audioRef.value.currentTime)
}

const onLoadedMetadata = () => {
  if (!audioRef.value) {
    return
  }

  audioDuration.value = Math.floor(audioRef.value.duration || 0)
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const seek = (event: MouseEvent) => {
  if (!audioRef.value || !totalDuration.value) {
    return
  }

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const maxPercent = trialProgress / 100
  const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), maxPercent)
  const nextTime = percent * totalDuration.value

  audioRef.value.currentTime = nextTime
  currentTime.value = Math.floor(nextTime)
}

const skip = (seconds: number) => {
  if (!audioRef.value || !totalDuration.value) {
    return
  }

  const maxTime = trialDuration.value || totalDuration.value
  const nextTime = Math.min(Math.max(audioRef.value.currentTime + seconds, 0), maxTime)
  audioRef.value.currentTime = nextTime
  currentTime.value = Math.floor(nextTime)
}

const toggleLike = () => {
  if (!detail.value) {
    return
  }

  const liked = detail.value.isGood === 1
  detail.value.isGood = liked ? 0 : 1
  detail.value.goodCount += liked ? -1 : 1
}

const toggleFav = () => {
  if (!detail.value) {
    return
  }

  const favored = detail.value.isFav === 1
  detail.value.isFav = favored ? 0 : 1
  detail.value.favCount += favored ? -1 : 1
}

const toggleFollow = () => {
  if (!detail.value) {
    return
  }

  detail.value.isFollow = detail.value.isFollow === 1 ? 0 : 1
}

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(Math.floor(seconds || 0), 0)
  const mins = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60

  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1).replace(/\.0$/, '')}w`
  }

  return `${count}`
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
@use 'sass:math';

@function vw($px) {
  @return math.div($px, 375px) * 100vw;
}

.listen-detail {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(22, 143, 132, 0.38) 0, rgba(22, 143, 132, 0) 32%),
    linear-gradient(180deg, #071b2f 0%, #020810 52%, #05111d 100%);
  color: #fff;
}

.screen {
  min-height: 100vh;
  padding: vw(10px) vw(18px) vw(110px);
  position: relative;
  overflow: hidden;
}

.screen::before {
  content: '';
  position: absolute;
  inset: vw(-120px) vw(-80px) auto;
  height: vw(320px);
  background: radial-gradient(circle, rgba(45, 203, 179, 0.34) 0, rgba(45, 203, 179, 0) 68%);
  pointer-events: none;
}

.content,
.top-bar,
.status-bar {
  position: relative;
  z-index: 1;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: vw(6px) 0 vw(8px);
  font-size: vw(16px);
  font-weight: 600;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: vw(8px);
}

.signal-bars {
  display: flex;
  align-items: flex-end;
  gap: vw(2px);
  height: vw(14px);
}

.signal-bars span {
  width: vw(3px);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
}

.signal-bars span:nth-child(1) {
  height: vw(5px);
}

.signal-bars span:nth-child(2) {
  height: vw(8px);
}

.signal-bars span:nth-child(3) {
  height: vw(11px);
}

.signal-bars span:nth-child(4) {
  height: vw(14px);
}

.status-icon {
  width: vw(18px);
  height: vw(18px);
}

.battery {
  width: vw(24px);
  height: vw(12px);
  border: vw(1.5px) solid rgba(255, 255, 255, 0.92);
  border-radius: vw(4px);
  position: relative;
}

.battery-cap {
  position: absolute;
  top: vw(3px);
  right: vw(-3px);
  width: vw(2px);
  height: vw(4px);
  border-radius: 0 999px 999px 0;
  background: rgba(255, 255, 255, 0.92);
}

.battery-core {
  position: absolute;
  inset: vw(2px);
  border-radius: vw(2px);
  background: rgba(255, 255, 255, 0.92);
}

.top-bar {
  display: flex;
  align-items: center;
  gap: vw(10px);
}

.top-bar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: vw(8px);
}

.author-pill {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: vw(10px);
  max-width: vw(112px);
}

.author-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: vw(12px);
  color: #cccccc;
}

.author-avatar,
.author-avatar-fallback {
  width: vw(20px);
  height: vw(20px);
  border-radius: vw(4px);
  flex-shrink: 0;
  object-fit: cover;
}

.author-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4fc3b8 0%, #22516f 100%);
  font-size: vw(14px);
  font-weight: 600;
}

.vip-chip,
.follow-btn,
.circle-btn,
.metric-button,
.rewind-chip,
.progress-bar,
.control-btn,
.play-button,
.more-btn,
.retry-btn {
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.circle-btn,
.follow-btn,
.metric-button,
.rewind-chip,
.control-btn,
.play-button,
.more-btn,
.retry-btn {
  cursor: pointer;
}

.icon-only {
  width: vw(30px);
  height: vw(30px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
}

.vip-chip {
  display: inline-flex;
  align-items: center;
  gap: vw(6px);
  padding: vw(6px) vw(11px);
  border-radius: vw(8px);
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255);
  font-size: vw(11px);
  line-height: 1;
  white-space: nowrap;
  backdrop-filter: blur(vw(12px));
}

.chip-icon {
  width: vw(14px);
  height: vw(14px);
  color: #f6c35d;
}

.follow-btn {
  min-width: vw(45px);
  height: vw(20px);
  padding: 0 vw(11px);
  border-radius: vw(6px);
  color: #6bedf2;
  border: vw(1px) solid #6bedf2;
  font-size: vw(11px);
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
}

.follow-btn.followed {
  border-color: #888888;
  color: #888888;
}

.content {
  padding-top: vw(26px);
}

.cover-card {
  position: relative;
  width: min(100%, vw(240px));
  margin: 0 auto;
  border-radius: vw(18px);
}

.cover-shadow {
  position: absolute;
  inset: vw(16px) vw(18px) vw(-20px);
  border-radius: vw(18px);
  background: rgba(0, 0, 0, 0.42);
  filter: blur(vw(22px));
}

.cover-image {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: vw(18px);
  box-shadow: 0 vw(24px) vw(48px) rgba(0, 0, 0, 0.34);
}

.title-section {
  margin-top: vw(24px);
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: vw(16px);
}

.audio-title {
  flex: 1;
  margin: 0;
  font-size: vw(16px);
  line-height: 1.28;
  letter-spacing: vw(0.2px);
  font-weight: 700;
}

.headline-actions {
  display: flex;
  align-items: center;
  gap: vw(14px);
}

.metric-button {
  display: flex;
  align-items: center;
  gap: vw(4px);
  color: rgba(255, 255, 255, 0.64);
  font-size: vw(14px);
}

.metric-button .icon-svg {
  width: vw(28px);
  height: vw(28px);
}

.metric-button .icon-img {
  width: vw(28px);
  height: vw(28px);
}

.metric-button .active {
  color: #62f0da;
}

.bullet-button {
  gap: vw(6px);
}

.bullet-label {
  width: vw(30px);
  height: vw(30px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: vw(1.5px) solid currentColor;
  border-radius: 50%;
  font-size: vw(14px);
}

.meta-row {
  margin-top: vw(12px);
  display: flex;
  align-items: center;
  gap: vw(10px);
  color: rgba(255, 255, 255, 0.56);
  font-size: vw(14px);
}

.breadcrumb {
  font-size: vw(12px);
}

.subscribe-tag {
  padding: vw(2px) vw(10px);
  border: vw(1px) solid #41dad1;
  border-radius: vw(4px);
  color: #6deade;
  line-height: 1.35;
  font-size: vw(10px);
}

.shortcut-grid {
  margin-top: vw(20px);
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: vw(12px) vw(6px);
}

.shortcut-item {
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
}

.shortcut-icon {
  width: vw(30px);
  height: vw(30px);
  margin: 0 auto vw(7px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: vw(18px);
  line-height: 1;
}

.shortcut-icon.outlined {
  border: vw(1.5px) solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  font-size: vw(15px);
}

.shortcut-icon .icon-svg {
  width: vw(30px);
  height: vw(30px);
}

.shortcut-value {
  min-height: vw(17px);
  font-size: vw(22px);
  line-height: 1;
  color: rgba(255, 255, 255, 0.86);
}

.shortcut-label {
  margin-top: vw(5px);
  font-size: vw(13px);
}

.progress-section {
  margin-top: vw(8px);
}

.progress-row {
  display: grid;
  grid-template-columns: vw(28px) 1fr vw(28px);
  align-items: center;
  column-gap: vw(12px);
}

.progress-main {
  position: relative;
  padding-top: 0;
}

.time-row {
  margin-top: vw(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: vw(13px);
  color: rgba(255, 255, 255, 0.82);
}

.rewind-chip {
  width: vw(19px);
  height: vw(21px);
}

.progress-bar {
  display: block;
  width: 100%;
}

.progress-track {
  position: relative;
  display: block;
  width: 100%;
  height: vw(6px);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.38);
}

.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: #fff;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: vw(12px);
  height: vw(12px);
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
}

.trial-thumb {
  position: absolute;
  top: 50%;
  width: vw(4px);
  height: vw(12px);
  border-radius: 999px;
  background: #fff;
  transform: translate(-50%, -50%);
}

.trial-pill-wrap {
  position: absolute;
  top: vw(18px);
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 2;
}

.trial-pill {
  padding: vw(7px) vw(12px);
  border-radius: vw(12px);
  background: rgba(53, 68, 86, 0.95);
  color: #d9dde3;
  font-size: vw(13px);
  line-height: 1.2;
  white-space: nowrap;
}

.player-controls {
  margin-top: vw(34px);
  display: grid;
  grid-template-columns: vw(52px) vw(48px) 1fr vw(48px) vw(52px);
  align-items: center;
  gap: vw(12px);
}

.wifi-icon {
  width: vw(16px);
  height: vw(12px);
  border: vw(1.8px) solid rgba(255, 255, 255, 0.9);
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 0 0 vw(12px) vw(12px);
  position: relative;
}

.wifi-icon::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: vw(1px);
  width: vw(4px);
  height: vw(4px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transform: translateX(-50%);
}

.control-btn {
  color: rgba(255, 255, 255, 0.78);
}

.control-btn .icon-svg {
  width: vw(32px);
  height: vw(32px);
}

img.control-btn.side-control {
  width: vw(28px);
  height: vw(28px);
  object-fit: contain;
}

.side-control {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: vw(6px);
  font-size: vw(14px);
  line-height: 1;
}

.align-right {
  align-items: flex-end;
}

.previous-btn,
.next-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.previous-btn .icon-svg,
.next-btn .icon-svg {
  width: vw(38px);
  height: vw(38px);
}

img.control-btn.previous-btn,
img.control-btn.next-btn {
  width: vw(34px);
  height: vw(40px);
  object-fit: contain;
}

.play-button {
  width: vw(78px);
  height: vw(78px);
  margin: 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: vw(24px);
  background: #f4f5f7;
  color: #101114;
  box-shadow: 0 vw(18px) vw(40px) rgba(0, 0, 0, 0.24);
}

.play-icon {
  width: vw(34px);
  height: vw(34px);
}

.reward-board {
  margin-top: vw(34px);
  padding: vw(18px) vw(16px) vw(20px);
  border-radius: vw(16px);
  background: rgba(8, 23, 36, 0.8);
  box-shadow: inset 0 vw(1px) 0 rgba(255, 255, 255, 0.04);
}

.reward-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reward-title {
  font-size: vw(18px);
  font-weight: 700;
  color: #f1fffc;
  text-shadow:
    0 0 0 #000,
    0 0 vw(10px) rgba(57, 255, 232, 0.35);
}

.more-btn {
  display: inline-flex;
  align-items: center;
  gap: vw(4px);
  font-size: vw(14px);
  color: rgba(255, 255, 255, 0.56);
}

.more-arrow {
  width: vw(10px);
  height: vw(20px);
  object-fit: contain;
}

.reward-list {
  margin-top: vw(14px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: vw(12px);
}

.reward-card {
  display: flex;
  justify-content: center;
}

.reward-avatar-shell {
  position: relative;
  width: vw(62px);
  height: vw(62px);
  padding: vw(4px);
  border-radius: vw(18px);
  background: linear-gradient(180deg, var(--accent) 0%, rgba(255, 255, 255, 0.06) 100%);
}

.reward-avatar {
  width: 100%;
  height: 100%;
  border-radius: vw(14px);
  object-fit: cover;
  background: #213040;
}

.reward-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: vw(24px);
  font-weight: 700;
  color: #fff;
}

.reward-badge {
  position: absolute;
  top: vw(-12px);
  left: vw(4px);
  width: vw(28px);
  height: vw(24px);
  object-fit: contain;
}

.comment-board {
  margin-top: vw(16px);
  padding: vw(18px) vw(12px) vw(12px);
  border-radius: vw(18px);
  background:
    linear-gradient(180deg, rgba(11, 31, 47, 0.96) 0%, rgba(5, 16, 27, 0.96) 100%),
    rgba(8, 23, 36, 0.9);
  box-shadow:
    inset 0 vw(1px) 0 rgba(255, 255, 255, 0.04),
    0 vw(18px) vw(36px) rgba(0, 0, 0, 0.16);
}

.comment-header {
  display: grid;
  grid-template-columns: vw(28px) 1fr auto;
  align-items: center;
  gap: vw(10px);
}

.comment-collapse {
  width: vw(28px);
  height: vw(28px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.collapse-icon {
  width: vw(16px);
  height: vw(9px);
  object-fit: contain;
}

.comment-title {
  margin: 0;
  font-size: vw(17px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
}

.comment-tabs {
  display: inline-flex;
  align-items: center;
  gap: vw(6px);
}

.comment-tab {
  min-width: vw(54px);
  height: vw(34px);
  padding: 0 vw(12px);
  border-radius: vw(12px);
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  font-size: vw(14px);
}

.comment-tab.active {
  background: rgba(114, 129, 154, 0.42);
  color: #fff;
  font-weight: 600;
}

.comment-list {
  margin-top: vw(12px);
}

.comment-item + .comment-item {
  margin-top: vw(20px);
  padding-top: vw(20px);
  border-top: vw(1px) solid rgba(80, 121, 153, 0.34);
}

.comment-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: vw(12px);
}

.comment-user {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: vw(10px);
  flex: 1;
}

.comment-avatar,
.comment-avatar-fallback {
  width: vw(42px);
  height: vw(42px);
  border-radius: vw(12px);
  object-fit: cover;
  flex-shrink: 0;
}

.comment-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--avatar-accent) 0%, rgba(34, 81, 111, 0.95) 100%);
  color: #fff;
  font-size: vw(18px);
  font-weight: 700;
}

.comment-meta {
  min-width: 0;
}

.comment-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: vw(15px);
  font-weight: 600;
}

.comment-time {
  margin-top: vw(2px);
  color: rgba(255, 255, 255, 0.48);
  font-size: vw(13px);
}

.comment-like {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: vw(4px);
}

.comment-like .icon-svg {
  width: vw(26px);
  height: vw(26px);
}

.comment-like .comment-like-icon {
  width: vw(26px);
  height: vw(26px);
}

.comment-content {
  margin: vw(12px) vw(50px) 0 vw(52px);
  color: rgba(255, 255, 255, 0.96);
  font-size: vw(17px);
  line-height: 1.6;
}

.reply-expand {
  margin: vw(14px) 0 0 vw(52px);
  display: inline-flex;
  align-items: center;
  gap: vw(4px);
  color: rgba(255, 255, 255, 0.42);
  font-size: vw(14px);
  border: 0;
  padding: 0;
  background: transparent;
}

.reply-expand .icon-svg {
  width: vw(18px);
  height: vw(18px);
}

.reply-arrow {
  width: vw(10px);
  height: vw(20px);
  object-fit: contain;
}

.reply-preview {
  margin: vw(14px) 0 0 vw(52px);
  padding: vw(14px) vw(14px) vw(12px);
  border-radius: vw(12px);
  background: rgba(108, 123, 145, 0.34);
}

.reply-author {
  color: rgba(255, 255, 255, 0.72);
  font-size: vw(13px);
}

.reply-text {
  margin-top: vw(6px);
  color: rgba(255, 255, 255, 0.92);
  font-size: vw(15px);
  line-height: 1.5;
}

.reply-time {
  margin-top: vw(8px);
  color: rgba(255, 255, 255, 0.45);
  font-size: vw(12px);
}

.comment-composer {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 5;
  width: 100%;
  padding: vw(10px) vw(22px) vw(18px);
  display: flex;
  align-items: center;
  gap: vw(14px);
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(5, 16, 27, 0) 0%, rgba(5, 16, 27, 0.96) 24%, rgba(5, 16, 27, 0.98) 100%);
  backdrop-filter: blur(vw(14px));
}

.locked-tip-line {
  flex-shrink: 0;
  width: vw(76px);
  height: vw(2px);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow: 0 0 vw(20px) rgba(255, 255, 255, 0.08);
}

.locked-tip-pill {
  flex: 1;
  min-height: vw(52px);
  padding: 0 vw(28px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #67dde3;
  color: #12313d;
  font-size: vw(20px);
  font-weight: 700;
  letter-spacing: vw(0.5px);
  box-shadow: 0 vw(12px) vw(24px) rgba(103, 221, 227, 0.2);
}

.icon-svg {
  width: vw(24px);
  height: vw(24px);
  display: block;
}

.icon-img {
  width: vw(24px);
  height: vw(24px);
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}

.state-block {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: vw(14px);
  color: rgba(255, 255, 255, 0.82);
}

.state-error {
  padding: vw(24px);
  text-align: center;
}

.retry-btn {
  min-width: vw(112px);
  height: vw(40px);
  border-radius: 999px;
  background: linear-gradient(135deg, #3fd1c0 0%, #148b84 100%);
  color: #fff;
}

.loading-spinner {
  width: vw(40px);
  height: vw(40px);
  border: vw(3px) solid rgba(255, 255, 255, 0.18);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
