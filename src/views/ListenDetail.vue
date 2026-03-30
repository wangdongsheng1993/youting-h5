<template>
  <div class="listen-detail">
    <div v-if="loading && !detail" class="state-block">
      <div class="loading-spinner"></div>
      <span>页面加载中...</span>
    </div>
    <div v-else-if="detail" class="screen">
      <div class="status-bar">
        <!-- <span class="status-time">9:41</span>
        <div class="status-icons">
          <div class="signal-bars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <svg viewBox="0 0 24 24" class="status-icon wifi-icon" aria-hidden="true">
            <path
              d="M3 9.5C8.6 5.1 15.4 5.1 21 9.5M6 13c3.9-3 8.1-3 12 0M9.3 16.3c1.8-1.4 3.6-1.4 5.4 0M12 19h.01"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="battery">
            <div class="battery-cap"></div>
            <div class="battery-core"></div>
          </div>
        </div> -->
      </div>

      <header class="top-bar">
        <!-- <button class="circle-btn icon-only" type="button">
          <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
            <path
              d="M15 5 8 12l7 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button> -->

        <div class="author-pill">
          <img v-if="avatarSource" :src="avatarSource" alt="avatar" class="author-avatar" />
          <div v-else class="author-avatar author-avatar-fallback">{{ displayName.slice(0, 1) }}</div>
          <span class="author-name">{{ displayName }}</span>
        </div>

        <div class="top-bar-actions">
          <div class="vip-chip">
            <svg viewBox="0 0 24 24" class="chip-icon" aria-hidden="true">
              <path
                d="M12 3 4 8l3.2 10h9.6L20 8l-8-5Z"
                fill="currentColor"
              />
            </svg>
            <span>开通会员，为Ta助力</span>
          </div>

          <button
            class="follow-btn"
            :class="{ followed: detail.isFollow === 1 }"
            type="button"
            @click="toggleFollow"
          >
            {{ detail.isFollow === 1 ? '已关注' : '关注' }}
          </button>

          <button class="circle-btn icon-only" type="button">
            <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
              <path
                d="M14 4h6v6M10 14 20 4M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
                <svg viewBox="0 0 24 24" class="icon-svg" :class="{ active: detail.isGood === 1 }" aria-hidden="true">
                  <path
                    d="M12 20.2s-7-4.4-7-10a4.2 4.2 0 0 1 7-2.9 4.2 4.2 0 0 1 7 2.9c0 5.6-7 10-7 10Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ formatCount(detail.goodCount) }}</span>
              </button>
              <button class="metric-button" type="button" @click="toggleFav">
                <svg viewBox="0 0 24 24" class="icon-svg" :class="{ active: detail.isFav === 1 }" aria-hidden="true">
                  <path
                    d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.4 6.4 20.4l1.1-6.3L2.9 9.6l6.3-.9L12 3Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ formatCount(detail.favCount) }}</span>
              </button>
              <button class="metric-button bullet-button" type="button">
                <span class="bullet-label">弹</span>
                <span>{{ formatCount(detail.commentCount || 89) }}</span>
              </button>
            </div>
          </div>

          <div class="meta-row">
            <span class="breadcrumb">{{ detail.cainaLook?.title || '通往异世界大门' }} ></span>
            <span class="subscribe-tag">订阅</span>
          </div>
        </section>

        <!-- <section class="shortcut-grid">
          <div v-for="item in shortcutItems" :key="item.key" class="shortcut-item">
            <div class="shortcut-icon">
              <svg v-if="item.key === 'cache'" viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                <path
                  d="M12 3v12M7 10l5 5 5-5M5 20h14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else-if="item.key === 'auto'" viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7" />
                <path
                  d="M9.6 16.4 12 7.8l2.4 8.6M10.4 13.4h3.2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else-if="item.key === 'coin'" viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7" />
                <path
                  d="M8.8 8.2h6.4M8 12h8M8.8 15.8h6.4M10 8.2v7.6M14 8.2v7.6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else-if="item.key === 'reward'" viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                <path
                  d="M12 3 9.4 8.4 3.5 9.2l4.3 4.2-1 5.9L12 16.4l5.2 2.9-1-5.9 4.3-4.2-5.9-.8L12 3Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                <path
                  d="M8 5h8M12 5v8M7 10h10M5 21l4.2-3H19a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v13Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="shortcut-value">{{ item.value }}</div>
            <div class="shortcut-label">{{ item.label }}</div>
          </div>
        </section> -->

        <section class="progress-section">
          <div class="progress-row">
            <button class="rewind-chip" type="button" @click="skip(-15)">15</button>
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
            <button class="rewind-chip" type="button" @click="skip(15)">15</button>
          </div>
        </section>

        <section class="player-controls">
          <button class="control-btn side-control" type="button">
            <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
              <path
                d="M4.5 12a7.5 7.5 0 0 1 13-5.2M19.5 12A7.5 7.5 0 0 1 7 17.5M4 7v-4h4M20 17v4h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>连播</span>
          </button>

          <button class="control-btn previous-btn" type="button">
            <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
              <path d="M18 6v12M16 17l-8-5 8-5v10Z" fill="currentColor" />
            </svg>
          </button>

          <button class="play-button" type="button" @click="togglePlay">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" class="play-icon" aria-hidden="true">
              <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="play-icon" aria-hidden="true">
              <path d="M9 7h2.8v10H9zm4.2 0H16v10h-2.8z" fill="currentColor" />
            </svg>
          </button>

          <button class="control-btn next-btn" type="button">
            <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
              <path d="M6 6v12M8 7l8 5-8 5V7Z" fill="currentColor" />
            </svg>
          </button>

          <button class="control-btn side-control align-right" type="button">
            <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
              <path
                d="M4 7h16M10 12h10M14 17h6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ `${episodeLabel}期` }}</span>
          </button>
        </section>

        <section class="reward-board">
          <div class="reward-header">
            <div class="reward-title">打赏榜单</div>
            <button class="more-btn" type="button">更多 ></button>
          </div>
          <div class="reward-list">
            <div v-for="user in rewardUsers" :key="user.name + user.badge" class="reward-card">
              <div class="reward-avatar-shell" :style="{ '--accent': user.accent }">
                <img v-if="user.image" :src="user.image" :alt="user.name" class="reward-avatar" />
                <div v-else class="reward-avatar reward-fallback">{{ user.name.slice(0, 1) }}</div>
                <span class="reward-badge">{{ user.badge }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="comment-board">
          <div class="comment-header">
            <button class="comment-collapse" type="button">
              <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                <path
                  d="m6 9 6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
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

                <button class="comment-like" type="button">
                  <svg viewBox="0 0 24 24" class="icon-svg" :class="{ active: comment.liked }" aria-hidden="true">
                    <path
                      d="M12 20.2s-7-4.4-7-10a4.2 4.2 0 0 1 7-2.9 4.2 4.2 0 0 1 7 2.9c0 5.6-7 10-7 10Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.9"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ comment.likes }}</span>
                </button>
              </div>

              <div class="comment-content">{{ comment.content }}</div>

              <button
                v-if="comment.replyCount"
                class="reply-expand"
                type="button"
              >
                一展开 {{ comment.replyCount }} 条回复
                <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
                  <path
                    d="m7 10 5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
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
  const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  const nextTime = percent * totalDuration.value

  audioRef.value.currentTime = nextTime
  currentTime.value = Math.floor(nextTime)
}

const skip = (seconds: number) => {
  if (!audioRef.value || !totalDuration.value) {
    return
  }

  const nextTime = Math.min(Math.max(audioRef.value.currentTime + seconds, 0), totalDuration.value)
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
.listen-detail {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(22, 143, 132, 0.38) 0, rgba(22, 143, 132, 0) 32%),
    linear-gradient(180deg, #071b2f 0%, #020810 52%, #05111d 100%);
  color: #fff;
}

.screen {
  min-height: 100vh;
  padding: 10px 18px 110px;
  position: relative;
  overflow: hidden;
}

.screen::before {
  content: '';
  position: absolute;
  inset: -120px -80px auto;
  height: 320px;
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
  padding: 6px 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signal-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}

.signal-bars span {
  width: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
}

.signal-bars span:nth-child(1) {
  height: 5px;
}

.signal-bars span:nth-child(2) {
  height: 8px;
}

.signal-bars span:nth-child(3) {
  height: 11px;
}

.signal-bars span:nth-child(4) {
  height: 14px;
}

.status-icon {
  width: 18px;
  height: 18px;
}

.battery {
  width: 24px;
  height: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.92);
  border-radius: 4px;
  position: relative;
}

.battery-cap {
  position: absolute;
  top: 3px;
  right: -3px;
  width: 2px;
  height: 4px;
  border-radius: 0 999px 999px 0;
  background: rgba(255, 255, 255, 0.92);
}

.battery-core {
  position: absolute;
  inset: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.92);
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-bar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-pill {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 124px;
}

.author-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.92);
}

.author-avatar,
.author-avatar-fallback {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.author-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4fc3b8 0%, #22516f 100%);
  font-size: 14px;
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
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
}

.vip-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.94);
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  backdrop-filter: blur(12px);
}

.chip-icon {
  width: 14px;
  height: 14px;
  color: #f6c35d;
}

.follow-btn {
  min-width: 58px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #3fd1c0 0%, #148b84 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
}

.follow-btn.followed {
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.82);
}

.content {
  padding-top: 54px;
}

.cover-card {
  position: relative;
  width: min(100%, 304px);
  margin: 0 auto;
  border-radius: 18px;
}

.cover-shadow {
  position: absolute;
  inset: 16px 18px -20px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.42);
  filter: blur(22px);
}

.cover-image {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.34);
}

.title-section {
  margin-top: 42px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.audio-title {
  flex: 1;
  margin: 0;
  font-size: 23px;
  line-height: 1.28;
  letter-spacing: 0.2px;
  font-weight: 700;
}

.headline-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.metric-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 14px;
}

.metric-button .icon-svg {
  width: 28px;
  height: 28px;
}

.metric-button .active {
  color: #62f0da;
}

.bullet-button {
  gap: 6px;
}

.bullet-label {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  font-size: 14px;
}

.meta-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.56);
  font-size: 14px;
}

.subscribe-tag {
  padding: 2px 10px;
  border: 1px solid #41dad1;
  border-radius: 6px;
  color: #6deade;
  line-height: 1.35;
  font-size: 12px;
}

.shortcut-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px 6px;
}

.shortcut-item {
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
}

.shortcut-icon {
  width: 34px;
  height: 34px;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shortcut-icon .icon-svg {
  width: 30px;
  height: 30px;
}

.shortcut-value {
  min-height: 17px;
  font-size: 22px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.86);
}

.shortcut-label {
  margin-top: 6px;
  font-size: 14px;
}

.progress-section {
  margin-top: 28px;
}

.progress-row {
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  align-items: center;
  column-gap: 12px;
}

.progress-main {
  position: relative;
  padding-top: 46px;
}

.time-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.82);
}

.rewind-chip {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
}

.progress-bar {
  display: block;
  width: 100%;
}

.progress-track {
  position: relative;
  display: block;
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.14);
  transform: translate(-50%, -50%);
}

.trial-thumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.14);
  transform: translate(-50%, -50%);
}

.trial-pill-wrap {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
}

.trial-pill-wrap::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 10px;
  height: 10px;
  background: rgba(112, 125, 140, 0.72);
  transform: translateX(-50%) rotate(45deg);
}

.trial-pill {
  width: fit-content;
  max-width: min(100vw - 88px, 260px);
  padding: 8px 14px;
  border-radius: 14px;
  background: rgba(112, 125, 140, 0.72);
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
  line-height: 1.3;
}

.player-controls {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 52px 48px 1fr 48px 52px;
  align-items: center;
  gap: 12px;
}

.control-btn {
  color: rgba(255, 255, 255, 0.78);
}

.control-btn .icon-svg {
  width: 32px;
  height: 32px;
}

.side-control {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  font-size: 14px;
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
  width: 38px;
  height: 38px;
}

.play-button {
  width: 78px;
  height: 78px;
  margin: 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: #f4f5f7;
  color: #101114;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
}

.play-icon {
  width: 34px;
  height: 34px;
}

.reward-board {
  margin-top: 34px;
  padding: 18px 16px 20px;
  border-radius: 16px;
  background: rgba(8, 23, 36, 0.8);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.reward-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reward-title {
  font-size: 18px;
  font-weight: 700;
  color: #f1fffc;
  text-shadow:
    0 0 0 #000,
    0 0 10px rgba(57, 255, 232, 0.35);
}

.more-btn {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.56);
}

.reward-list {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reward-card {
  display: flex;
  justify-content: center;
}

.reward-avatar-shell {
  position: relative;
  width: 62px;
  height: 62px;
  padding: 4px;
  border-radius: 18px;
  background: linear-gradient(180deg, var(--accent) 0%, rgba(255, 255, 255, 0.06) 100%);
}

.reward-avatar {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  background: #213040;
}

.reward-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.reward-badge {
  position: absolute;
  top: -10px;
  left: 8px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: #111;
  font-size: 12px;
  font-weight: 700;
}

.comment-board {
  margin-top: 16px;
  padding: 18px 12px 12px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(11, 31, 47, 0.96) 0%, rgba(5, 16, 27, 0.96) 100%),
    rgba(8, 23, 36, 0.9);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 18px 36px rgba(0, 0, 0, 0.16);
}

.comment-header {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
}

.comment-collapse {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
  border: 0;
  padding: 0;
  background: transparent;
}

.comment-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
}

.comment-tabs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.comment-tab {
  min-width: 54px;
  height: 34px;
  padding: 0 12px;
  border-radius: 12px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.comment-tab.active {
  background: rgba(114, 129, 154, 0.42);
  color: #fff;
  font-weight: 600;
}

.comment-list {
  margin-top: 12px;
}

.comment-item + .comment-item {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(80, 121, 153, 0.34);
}

.comment-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.comment-user {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
}

.comment-avatar,
.comment-avatar-fallback {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--avatar-accent) 0%, rgba(34, 81, 111, 0.95) 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.comment-meta {
  min-width: 0;
}

.comment-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 600;
}

.comment-time {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.48);
  font-size: 13px;
}

.comment-like {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.66);
}

.comment-like .icon-svg {
  width: 26px;
  height: 26px;
}

.comment-like .active {
  color: #ff3d78;
}

.comment-content {
  margin: 12px 50px 0 52px;
  color: rgba(255, 255, 255, 0.96);
  font-size: 17px;
  line-height: 1.6;
}

.reply-expand {
  margin: 14px 0 0 52px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 14px;
  border: 0;
  padding: 0;
  background: transparent;
}

.reply-expand .icon-svg {
  width: 18px;
  height: 18px;
}

.reply-preview {
  margin: 14px 0 0 52px;
  padding: 14px 14px 12px;
  border-radius: 12px;
  background: rgba(108, 123, 145, 0.34);
}

.reply-author {
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
}

.reply-text {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 15px;
  line-height: 1.5;
}

.reply-time {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
}

.comment-composer {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 5;
  width: min(100%, 750px);
  padding: 10px 22px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(5, 16, 27, 0) 0%, rgba(5, 16, 27, 0.96) 24%, rgba(5, 16, 27, 0.98) 100%);
  backdrop-filter: blur(14px);
}

.locked-tip-line {
  flex-shrink: 0;
  width: 76px;
  height: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.08);
}

.locked-tip-pill {
  flex: 1;
  min-height: 52px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #67dde3;
  color: #12313d;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 12px 24px rgba(103, 221, 227, 0.2);
}

.icon-svg {
  width: 24px;
  height: 24px;
  display: block;
}

.state-block {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.82);
}

.state-error {
  padding: 24px;
  text-align: center;
}

.retry-btn {
  min-width: 112px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(135deg, #3fd1c0 0%, #148b84 100%);
  color: #fff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 420px) {
  .screen {
    padding-left: 14px;
    padding-right: 14px;
  }

  .top-bar {
    gap: 8px;
  }

  .author-pill {
    max-width: 92px;
  }

  .vip-chip {
    padding-left: 9px;
    padding-right: 9px;
    font-size: 11px;
  }

  .content {
    padding-top: 42px;
  }

  .audio-title {
    font-size: 20px;
  }

  .progress-row {
    column-gap: 8px;
  }

  .progress-main {
    padding-top: 42px;
  }

  .trial-pill {
    max-width: min(100vw - 72px, 220px);
  }

  .comment-content,
  .reply-expand,
  .reply-preview {
    margin-left: 0;
  }

  .comment-content {
    margin-right: 0;
  }

  .comment-composer {
    padding-left: 14px;
    padding-right: 14px;
    gap: 10px;
  }

  .locked-tip-line {
    width: 44px;
  }

  .locked-tip-pill {
    min-height: 48px;
    padding: 0 20px;
    font-size: 18px;
  }
}
</style>
