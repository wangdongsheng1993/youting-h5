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
          <!-- <img v-if="avatarSource" :src="avatarSource" alt="avatar" class="author-avatar" />
          <div v-else class="author-avatar author-avatar-fallback">{{ displayName.slice(0, 1) }}</div>
          <span class="author-name">{{ displayName }}</span> -->
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
                <img :src="dislikeImg" alt="like" class="icon-img" :class="{ active: detail.isGood === 1 }" />
                <span>{{ formatCount(detail.goodCount) }}</span>
              </button>
              <button class="metric-button" type="button" @click="toggleFav">
                <img :src="uncollectedImg" alt="favorite" class="icon-img" :class="{ active: detail.isFav === 1 }" />
                <span>{{ formatCount(detail.favCount) }}</span>
              </button>
              <button class="metric-button bullet-button" type="button">
                <img :src="danmuImg" alt="favorite" class="icon-img" :class="{ active: detail.isBullet === 1 }" />
              </button>
            </div>
          </div>

          <div class="meta-row">
            <span v-if="detail.cainaLook?.title" class="breadcrumb">{{ detail.cainaLook?.title || '通往异世界大门' }} ></span>
            <span class="subscribe-tag">订阅</span>
          </div>
        </section>

        <section class="-section">

        </section>

        <section class="progress-section">
          <div class="progress-row">
            <img :src="rewindChipImg" alt="rewind" class="rewind-chip" @click="skip(-15)" />
            <div class="progress-main">
              <div class="trial-pill-wrap">
                <div class="trial-pill">
                  试听30%，收听完整版请<span style="color: #6bedf2;" @click="showDownloadTip">充值</span>或<span style="color: #6bedf2;" @click="showDownloadTip">补充广告币</span>
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
            <img :src="rewindChip1Img" alt="forward" class="rewind-chip" @click="skip(15)" />
          </div>
        </section>

        <section class="player-controls">

          <button class="control-btn side-control align-right" type="button" @click="showDownloadTip">
            <img :src="playIconImg" alt="favorite" class="control-btn side-control" />
            <span>连播</span>
          </button>
          <img :src="1 === 1 ? backImg : back1Img" alt="favorite" class="control-btn previous-btn" @click="showDownloadTip" />
          <img
            :src="isPlaying ? followImg : follow1Img"
            alt="favorite"
            class="play-button"
            @click="togglePlay"
          />
          <img :src="1 === 1 ? moreImg : more1Img" alt="favorite" class="control-btn next-btn" @click="showDownloadTip" />


          <button class="control-btn side-control align-right" type="button" @click="showDownloadTip">
            <img :src="plusImg" alt="favorite" class="control-btn side-control" />
            <span style="width: max-content;">{{ `${episodeLabel}期` }}</span>
          </button>
        </section>

        <section class="reward-board">
          <div class="reward-header">
            <div class="reward-title">
              <img :src="rewardTitleBgImg" alt="reward title background" class="reward-title-bg" />
              <span>打赏榜单</span>
            </div>
            <button class="more-btn" type="button" @click="showDownloadTip">
              更多
              <img :src="arrowRightImg" alt="favorite" class="more-arrow" />
            </button>
          </div>
          <div class="reward-list">
            <div v-for="(user, index) in topHelpPiaoList" :key="user.id || index" class="reward-card">
              <div class="reward-avatar-shell" :style="{ '--accent': accent[index] || '#F6BE53' }">
                <img v-if="user.user?.imagePath" :src="user.user?.imagePath" :alt="user.user?.nickName" class="reward-avatar" />
                <div v-else class="reward-avatar reward-fallback">{{ user.user?.nickName?.slice(0, 1) || 'U' }}</div>
                <img v-if="index < 3" :src="index === 0 ? crownSilverImg : index === 1 ? crownSilver1Img : crownSilver2Img" :alt="user.user?.nickName" class="reward-badge" />
              </div>
            </div>
            <div v-if="topHelpPiaoList.length === 0" class="reward-card">
              <div class="reward-avatar-shell" style="--accent: transparent">
                <div class="reward-avatar reward-fallback">无</div>
              </div>
            </div>
          </div>
        </section>

        <section class="comment-board">
          <div class="comment-header">
            <button class="comment-collapse" type="button" @click="showDownloadTip">
              <img :src="minusImg" alt="collapse" class="collapse-icon" />
            </button>
            <h2 class="comment-title">评论 ({{ commentTotalCount }})</h2>
            <div class="comment-tabs">
              <button
                v-for="tab in commentTabs"
                :key="tab.key"
                class="comment-tab"
                :class="{ active: currentCommentTab === tab.key }"
                type="button"
                @click="changeCommentTab(tab.key)"
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
                    v-if="comment.user.imagePath"
                    :src="comment.user.imagePath"
                    :alt="comment.user.nickName"
                    class="comment-avatar"
                  />
                  <div
                    v-else
                    class="comment-avatar comment-avatar-fallback"
                    :style="{ '--avatar-accent': comment.avatarAccent }"
                  >
                    {{ comment.user.nickName.slice(0, 1) }}
                  </div>
                  <div class="comment-meta">
                    <div class="comment-name">{{ comment.user.nickName }}</div>
                    <div class="comment-time">{{ comment.createTime }}</div>
                  </div>
                </div>

                <div class="comment-like" type="button" @click="showDownloadTip">
                  <img :src="comment.liked ? likeImg : dislikeImg" alt="like" class="icon-img comment-like-icon" />
                  <span>{{ comment.likes }}</span>
                </div>
              </div>

              <div class="comment-content">{{ comment.content }}</div>

              <button
                v-if="comment.replyCount"
                class="reply-expand"
                type="button"
                @click="toggleReply(comment.id)"
              >
                {{ comment.showReply ? '收起回复' : `展开 ${comment.replyCount} 条回复` }}
                <img :src="arrowRightImg" alt="expand" class="reply-arrow" :class="{ rotated: comment.showReply }" />
              </button>

              <div v-if="comment.showReply && comment.replies" class="reply-list">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <div class="reply-author">{{ reply.author }}</div>
                  <div class="reply-text">{{ reply.content }}</div>
                  <div class="reply-time">{{ reply.time }}</div>
                </div>
              </div>

              <div v-else-if="comment.replyPreview" class="reply-preview">
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

    <!-- 提示弹窗 -->
    <div v-if="showTip" class="tip-modal">
      <div class="tip-content">
        <button class="tip-close" @click="closeTip">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="tip-icon">
          <div class="welcome-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" fill="rgba(255,255,255,0.2)"/>
              <path d="M20 30C20 24.4772 24.4772 20 30 20C35.5228 20 40 24.4772 40 30C40 35.5228 35.5228 40 30 40C24.4772 40 20 35.5228 20 30Z" fill="white"/>
              <circle cx="30" cy="30" r="10" fill="#4fc3b8"/>
              <path d="M26 30L29 33L36 26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <h3 class="tip-title">欢迎下载 <span class="app-name">有听故事圈</span></h3>
        <button class="tip-button" @click="jumpToApp">立即下载</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getListenDetail, getListenTopHelpPiao, getCommentList } from '../api/listen'
import type { ListenVO } from '../types'
import backImg from '../assets/images/back.svg'
import back1Img from '../assets/images/back-1.svg'
import followImg from '../assets/images/follow.svg'
import follow1Img from '../assets/images/follow-1.svg'
import plusImg from '../assets/images/plus.svg'
import moreImg from '../assets/images/more.svg'
import more1Img from '../assets/images/more-1.svg'
import favoriteImg from '../assets/images/favorite.svg'
import playIconImg from '../assets/images/play-icon.svg'
import diamondImg from '../assets/images/diamond.png'
import rewindChipImg from '../assets/images/rewind-chip.svg'
import rewindChip1Img from '../assets/images/rewind-chip-1.svg'
import arrowRightImg from '../assets/images/icon-arrow-right.svg'
import crownSilverImg from '../assets/images/crown-silver.svg'
import crownSilver1Img from '../assets/images/crown-silver-1.svg'
import crownSilver2Img from '../assets/images/crown-silver-2.svg'
import minusImg from '../assets/images/minus.svg'
import likeImg from '../assets/images/like.svg'
import dislikeImg from '../assets/images/dislike.svg'
import collectedImg from '../assets/images/collected.svg'
import uncollectedImg from '../assets/images/uncollected.svg'
import danmuImg from '../assets/images/danmu.svg'
import rewardTitleBgImg from '../assets/images/reward-title-bg.svg'

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
const topHelpPiaoList = ref<any[]>([])
const commentList = ref<any[]>([])
const commentTotalCount = ref<number>(0)
const showTip = ref(false)
const contentId = ref<number>(0)
const contentType = ref<number>(0)

const changeCommentTab = (tab: 'latest' | 'hottest') => {
  currentCommentTab.value = tab
  // 重新获取评论数据
  if (contentId.value > 0) {
    getCommentList({
      current: 1,
      size: 10,
      pageNo: 1,
      pageSize: 10,
      targetType: contentType.value,
      targetId: contentId.value,
      orderBy: tab === 'latest' ? 1 : 2 // 1 最新，2 最热
    }).then(response => {
      if (response.success && response.data) {
        commentList.value = response.data.list || []
        commentTotalCount.value = response.data.page.total || 0
      }
    })
  }
}

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
const accent = ['#F6BE53', '#9AC1D9', '#F3882A', 'transparent']

const commentTabs = [
  { key: 'latest', label: '最新' },
  { key: 'hottest', label: '最热' }
] as const

// 处理评论数据，添加必要的属性
const processedCommentList = computed(() => {
  return commentList.value.map((comment:any) => ({
    ...comment,
    showReply: false,
    avatarAccent: comment.avatarAccent || '#5dd8ce'
  }))
})

const displayedComments = computed(() => {
  if (currentCommentTab.value === 'latest') {
    return processedCommentList.value
  }

  return [...processedCommentList.value].sort((a, b) => b.likes - a.likes)
})

const getUrlParams = () => {
  const url = window.location.href
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(url.split('?')[1] || '')
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value
  }
  
  return params
}

const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    // 从URL获取参数
    const params = getUrlParams()
    const id = Number(params.id) || 1309
    const targetType = Number(params.targetType) || 2
    
    contentId.value = id
    contentType.value = targetType
    
    // 获取音频详情
    const response = await getListenDetail(id)

    if (response.success && response.data) {
      detail.value = response.data
    } else {
      detail.value = createMockDetail()
      error.value = response.message || '已展示设计稿预览数据'
    }
    
    // 获取榜单数据
    const topHelpPiaoResponse = await getListenTopHelpPiao(id, 4)
    if (topHelpPiaoResponse.success && topHelpPiaoResponse.data) {
      topHelpPiaoList.value = topHelpPiaoResponse.data
    }

    // 获取评论列表
    const commentResponse = await getCommentList({
      current: 1,
      size: 10,
      pageNo: 1,
      pageSize: 10,
      targetType: targetType,
      targetId: id,
      orderBy: currentCommentTab.value === 'latest' ? 1 : 2 // 1 最新，2 最热
    })
    if (commentResponse.success && commentResponse.data) {
      commentList.value = commentResponse.data.list || []
      commentTotalCount.value = commentResponse.data.page.total || 0
    }
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
    showDownloadTip()
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
    showDownloadTip()
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
  
  if (percent >= maxPercent) {
    audioRef.value.pause()
    isPlaying.value = false
    showDownloadTip()
  }
}

const skip = (seconds: number) => {
  if (!audioRef.value || !totalDuration.value) {
    return
  }

  const maxTime = trialDuration.value || totalDuration.value
  const nextTime = Math.min(Math.max(audioRef.value.currentTime + seconds, 0), maxTime)
  audioRef.value.currentTime = nextTime
  currentTime.value = Math.floor(nextTime)
  
  // 如果跳转到了30%的位置，弹出提示
  if (nextTime >= maxTime) {
    audioRef.value.pause()
    isPlaying.value = false
    showDownloadTip()
  }
}

const toggleLike = () => {
  showDownloadTip();
}

const toggleFav = () => {
  showDownloadTip();

}

const toggleFollow = () => {
  showDownloadTip();
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

const showDownloadTip = () => {
  showTip.value = true
}

const jumpToApp = () => {
  // 封装跳转到有听故事圈的方法
  const appUrl = 'youtinggsq://app'
  const webUrl = 'https://www.youtinggsq.com/download'
  
  // 尝试打开APP
  window.location.href = appUrl
  
  // 如果500ms后没有打开APP，跳转到下载页面
  setTimeout(() => {
    window.location.href = webUrl
  }, 500)
}

const closeTip = () => {
  showTip.value = false
  // 重置音频进度并暂停
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    currentTime.value = 0
    isPlaying.value = false
  }
}

const toggleReply = (commentId: number) => {
  const comment = commentList.value.find((c:any) => c.id === commentId)
  if (comment) {
    comment.showReply = !comment.showReply
  }
}

const autoPlayAudio = () => {
  if (audioRef.value && detail.value?.filePath) {
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }
}

onMounted(() => {
  fetchData()
  // 延迟自动播放，确保音频元素已加载
  setTimeout(autoPlayAudio, 1000)
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
  gap: vw(3px);
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
  height: vw(26px);
  gap: vw(4px);
  padding: vw(2px) vw(6px);
  border-radius: vw(8px);
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255);
  font-size: vw(11px);
  line-height: 1;
  white-space: nowrap;
  backdrop-filter: blur(vw(12px));
}

.chip-icon {
  width: vw(17px);
  height: vw(14px);
  color: #f6c35d;
}

.circle-btn .icon-img {
  width: vw(15px);
  height: vw(15px);
}

.follow-btn {
  min-width: vw(45px);
  height: vw(20px);
  padding: 0 vw(5px);
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
  align-items: center;
  gap: vw(16px);
}

.audio-title {
  flex: 1;
  margin: 0;
  font-size: vw(16px);
  line-height: 1.28;
  letter-spacing: vw(0px);
  font-weight: 700;
  white-space: nowrap;
  text-overflow: clip;
  overflow: hidden;
  width: vw(187px);
}

.headline-actions {
  display: flex;
  align-items: center;
  gap: vw(10px);
}

.metric-button {
  display: flex;
  align-items: center;
  gap: vw(1px);
  color: rgba(255, 255, 255, 0.64);
  font-size: vw(10px);
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

.metric-button span {
  margin-top: auto;
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
  margin-top: vw(2px);
  display: flex;
  align-items: center;
  gap: vw(8px);
  color: rgba(255, 255, 255, 0.56);
  font-size: vw(12px);
}

.breadcrumb {
  font-size: vw(12px);
}

.subscribe-tag {
  padding: vw(4px);
  border: vw(1px) solid #41dad1;
  border-radius: vw(4px);
  color: #6deade;
  line-height: vw(9px);
  font-size: vw(9px);
  width: vw(35px);
  text-align: center;
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
  margin-top: vw(18px);
}

.progress-row {
  display: grid;
  grid-template-columns: vw(20px) 1fr vw(22px);
  align-items: normal;
  column-gap: vw(12px);
}

.progress-main {
  position: relative;
  padding-top: 0;
  top: vw(9px);
}

.time-row {
  margin-top: vw(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: vw(10px);
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
  height: vw(2px);
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
  width: vw(6px);
  height: vw(6px);
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
}

.trial-thumb {
  position: absolute;
  top: 50%;
  width: vw(3px);
  height: vw(6px);
  border-radius: 999px;
  background: #fff;
  transform: translate(-50%, -50%);
}

.trial-pill-wrap {
  position: absolute;
  top: vw(12px);
  left: vw(30px);
  pointer-events: none;
  z-index: 2;
}

.trial-pill-wrap::before {
  content: '';
  position: absolute;
  top: vw(-18px);
  left: vw(47px);
  display: block;
  width: 0;
  height: 0;
  border-color: #3E4347;
  border-bottom: vw(10px) solid #3E4347;
  border-top: vw(10px) solid transparent;
  border-left: vw(5px) solid transparent;
  border-right: vw(5px) solid transparent;
}

.trial-pill {
  padding: vw(2px) vw(6px);
  border-radius: vw(8px);
  background: #3E4347;
  color: #d9dde3;
  font-size: vw(10px);
  white-space: nowrap;
  height: vw(26px);
  line-height: vw(22px);
}

.player-controls {
  margin-top: vw(34px);
  display: grid;
  align-items: center;
  gap: vw(48px);
  grid-template-columns: vw(22px) vw(20px) 1fr vw(20px) vw(25px);
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
  width: vw(22px);
  height: vw(22px);
  object-fit: contain;
}

.side-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: vw(6px);
  font-size: vw(11px);
  line-height: 1;
  color: #888888;
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
  width: vw(17px);
  height: vw(20px);
  object-fit: contain;
}

.play-button {
  width: vw(56px);
  height: vw(56px);
  margin: 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: vw(16px);
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
  padding: vw(14px) vw(12px);
  border-radius: vw(8px);
  background: #11191F;
}

.reward-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reward-title {
  font-size: vw(16px);
  font-weight: 700;
  height: vw(20px);
  color: #f1fffc;
  position: relative;
}

.reward-title-bg {
  width: vw(18px);
  height: vw(18px);
  object-fit: contain;
  position: absolute;
  top: vw(2px);
  z-index: 0;
}

.reward-title span {
  position: relative;
  z-index: 1;
}

.more-btn {
  display: inline-flex;
  align-items: center;
  gap: vw(4px);
  font-size: vw(12px);
  color: #888888;
}

.more-arrow {
  width: vw(5px);
  height: vw(10px);
  object-fit: contain;
}

.reward-list {
  margin-top: vw(22px);
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
  width: vw(46px);
  height: vw(46px);
  border-radius: vw(8px);
  border: vw(2px) solid var(--accent);
}

.reward-avatar {
  width: 100%;
  height: 100%;
  border-radius: vw(6.4px);
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
  top: vw(-14px);
  left: vw(15px);
  width: vw(14px);
  height: vw(12px);
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
  margin: 0 auto;
  font-size: vw(16px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.96);
}

.comment-tabs {
  display: inline-flex;
  align-items: center;
  gap: vw(2px);
}

.comment-tab {
  min-width: vw(41px);
  height: vw(22px);
  padding: vw(3px) vw(8px);
  border-radius: vw(6px);
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  font-size: vw(12px);
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
  width: vw(32px);
  height: vw(32px);
  border-radius: vw(4px);
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
  font-size: vw(12px);
}

.comment-time {
  margin-top: vw(2px);
  color: rgba(255, 255, 255, 0.48);
  font-size: vw(10px);
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
  margin: vw(12px) vw(5px) 0 vw(42px);
  color: rgba(255, 255, 255, 0.96);
  font-size: vw(14px);
  line-height: vw(22px);
}

.reply-expand {
  margin: vw(14px) 0 0 vw(42px);
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
  font-size: vw(10px);
}

.reply-text {
  margin-top: vw(6px);
  color: rgba(255, 255, 255, 0.92);
  font-size: vw(12px);
  line-height: 1.5;
}

.reply-time {
  margin-top: vw(5px);
  color: rgba(255, 255, 255, 0.45);
  font-size: vw(10px);
}

.comment-composer {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 5;
  width: 100%;
  padding: vw(18px) vw(22px) vw(18px);
  display: flex;
  align-items: center;
  gap: vw(14px);
  transform: translateX(-50%);
  background: linear-gradient(to bottom, rgba(180, 180, 180, 0.4), rgba(180, 180, 180, 0.6), rgba(180, 180, 180, 0.9));
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
  font-size: vw(18px);
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

.tip-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tip-content {
  width: 80%;
  max-width: 320px;
  background: linear-gradient(180deg, #4fc3b8 0%, #22516f 100%);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.tip-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.tip-icon {
  margin-bottom: 24px;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-title {
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
}

.app-name {
  font-size: 28px;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tip-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.4;
}

.tip-button {
  width: 100%;
  height: 50px;
  background: white;
  border: none;
  border-radius: 25px;
  color: #22516f;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.tip-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
}
</style>