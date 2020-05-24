<template>
  <div class="container py-5">

    <template>
      asd
      <RoomDetail :initial-theme="room" />
      <hr />
      <RoomMessages
        :theme-comments="RoomMessages"
      />
      <CreateMessage :room-id="room.id" @after-create-message="afterCreateMessage" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoomDetail from '@/components/Room'
import RoomMessages from '@/components/RoomMessages'
import CreateMessage from '@/components/CreateMessage'

import chatsAPI from '@/apis/chat'
import { Toast } from '@/utils/helpers'

export default {
  components: {
    RoomDetail,
    RoomMessages,
    CreateMessage
  },
  data() {
    return {
      room: {
        id: -1,
        name: ''
      },
      themeMessages: [],
      isLoading: true
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created() {
    const { id: roomId } = this.$route.params
    this.fetchTheme(roomId)
  },
  beforeRouteUpdate(to, from, next) {
    const { id: roomId } = to.params
    this.fetchTheme(roomId)
    next()
  },
  methods: {
    async fetchTheme(roomId) {
      try {
        const { data, statusText } = await chatsAPI.getRoom({
          roomId
        })

        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        this.theme = {
          id: data.room.id,
          name: data.room.name,
        }
        this.RoomMessages = data.room.Messages
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        Toast.fire({
          type: 'error',
          title: 'Не удалось получить информацию о комнате, повторите попытку позже.'
        })
      }
    },
    afterCreateComment(payload) {
      const { messageId, roomId, text } = payload
      this.RoomMessages.push({
        id: messageId,roomId,
        User: {
          id: this.currentUser.id,
          name: this.currentUser.name
        },
        text,
        createdAt: new Date()
      })
    }
  }
}
</script>
