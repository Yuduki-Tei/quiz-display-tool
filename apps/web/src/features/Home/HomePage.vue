<template>
  <div class="home-page">
    <div class="room-join" v-if="!joined">
      <h2 class="section-title">Multiplayer</h2>
      <form @submit.prevent="joinRoom">
        <input
          v-model="roomInput"
          placeholder="Room name"
          required
          class="room-input"
        />
        <button type="submit" class="join-btn">Join</button>
      </form>
    </div>
    <div class="room-info" v-else>
      <p class="room-label">房間名稱: <strong>{{ roomInfo.roomId }}</strong></p>
      <p class="room-label">人數: <strong>{{ roomInfo.usersCount }} 人</strong></p>
      <button class="leave-btn" @click="leave">Leave</button>
    </div>
    <div class="quiz-section">
      <h2 class="section-title">{{ t("home.imageQuiz") }}</h2>
      <div class="mode-selection" role="group" :aria-label="t('aria.selectMode')">
        <button
          class="mode-card"
          @click="selectMode('zoomer')"
          :aria-label="t('home.zoomerMode')"
          tabindex="0"
          role="button"
        >
          <Icon
            name="PhPictureInPicture"
            size="128"
            color="#039390"
            aria-hidden="true"
          />
          <span class="mode-name">{{ t("home.zoomerMode") }}</span>
        </button>
        <button
          class="mode-card"
          @click="selectMode('panel')"
          :aria-label="t('home.panelMode')"
          tabindex="0"
          role="button"
        >
          <Icon
            name="PhCheckerboard"
            size="128"
            color="#039390"
            aria-hidden="true"
          />
          <span class="mode-name">{{ t("home.panelMode") }}</span>
        </button>
      </div>
    </div>
    <div class="quiz-section">
      <h2 class="section-title">{{ t("home.textQuiz") }}</h2>
      <div class="mode-selection" role="group" :aria-label="t('aria.selectMode')">
        <button
          class="mode-card"
          @click="selectMode('text-panel')"
          :aria-label="t('home.panelMode')"
          tabindex="0"
          role="button"
        >
          <Icon
            name="PhCheckerboard"
            size="128"
            color="#039390"
            aria-hidden="true"
          />
          <span class="mode-name">{{ t("home.panelMode") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Icon from "@/components/Icon.vue";
import { ref, reactive } from "vue";
import { connectRoom, onRoomInfo, getCurrentRoomInfo, leaveRoom } from "@/realtime/socket";

const { t } = useI18n();
const router = useRouter();

// Multiplayer minimal state
const roomInput = ref("");
const joined = ref(false);
const role = ref<'host' | 'viewer' | null>(null);
const roomInfo = reactive({ roomId: '', usersCount: 0 });

onRoomInfo((info) => {
  roomInfo.roomId = info.roomId;
  roomInfo.usersCount = info.usersCount;
});

const joinRoom = async () => {
  if (!roomInput.value.trim()) return;
  const userId = `user-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const res = await connectRoom(roomInput.value.trim(), userId);
    role.value = res.role;
    joined.value = true;
    const current = getCurrentRoomInfo();
    roomInfo.roomId = current.roomId || '';
    roomInfo.usersCount = current.usersCount;
  } catch (e) {
    console.error('Join failed', e);
  }
};

const leave = () => {
  leaveRoom();
  joined.value = false;
  role.value = null;
  roomInfo.roomId = '';
  roomInfo.usersCount = 0;
};

const selectMode = (mode: "zoomer" | "panel" | "text-panel") => {
  router.push(`/${mode}`);
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 0;
}

.room-join, .room-info {
  margin-bottom: 2rem;
  text-align: center;
}

.room-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  margin-right: 0.5rem;
  min-width: 200px;
}

.join-btn, .leave-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--el-color-primary);
  background: var(--el-color-primary);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.join-btn:hover, .leave-btn:hover {
  opacity: 0.9;
}

.room-label { margin: 0.25rem 0; }

.quiz-section {
  margin-bottom: 3rem;
  width: 100%;
  max-width: 800px;
}

.quiz-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.mode-selection {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.mode-card {
  border-radius: 8px;
  padding: 2rem;
  width: 300px;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: solid 1px;
  border-color: var(--el-border-color);
  background: none;
}

.mode-name {
  font-size: 1.25rem;
  margin-top: 1rem;
  font-weight: 600;
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 10px var(--el-color-primary-dark-2);
}
</style>
