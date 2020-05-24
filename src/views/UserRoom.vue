<template>
  <div class="container py-5">
    <Spinner v-if="isLoading" />
    <template v-else>
      <body>
        <div class="container">
          <h3 class=" text-center"></h3>
          <div class="messaging">
            <div class="inbox_msg">
              <div class="inbox_people">
                <div class="headind_srch">
                  <div class="recent_heading">
                    <h4><a href="#" @click="$router.back()">Назад</a></h4>
                  </div>
                  <div class="srch_bar">
                  </div>
                </div>
                <div class="inbox_chat">
                  <div class="chat_list active_chat">
                    <div class="chat_people">
                      <div class="chat_img"> <img :src="roomImage" alt="sunil"> </div>
                      <div class="chat_ib">
                        <h5>{{ room.Product != null ? room.Product.User.name : "Продукт"}} {{ room.Product != null ? room.Product.User.lastname : "удален"}} <span class="chat_date">{{ room.createdAt | fromNow }}</span></h5>
                        <p>{{ room.Product != null ? room.Product.name : "Продукт удален"}}</p>
                      </div>
                    </div>
                  </div>
                  <RoomMessages
                  :room-messages="roomMessages"
                  @after-delete-message="afterDeleteMessage"
                  />
                </div>
                <div class="ml-2 mr-2 mt-2">
                  <div class="type_msg">
                    <div class="input_msg_write">
                      <CreateMessage :room-id="room.id" @after-create-message="afterCreateMessage" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div></div>
        </body>
      </template>
    </div>
  </template>

<script>
import { mapState } from 'vuex'
import RoomMessages from '@/components/RoomMessages'
import CreateMessage from '@/components/CreateMessage'
import Spinner from '@/components/Spinner'

import chatsAPI from '@/apis/chat'
import { Toast } from '@/utils/helpers'
import { fromNowFilter } from '@/utils/mixins'
export default {

mixins: [fromNowFilter],
  components: {
    RoomMessages,
    CreateMessage,
    Spinner
  },
  data() {
    return {
      room: {
        id: -1,
        createdAt: ''

      },
      roomMessages: [],
      isLoading: true
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created() {
    const { id: roomId } = this.$route.params
    console.log('11111111 search bug: ', this.currentUser.id)
    this.fetchRoom(roomId)
  },
  beforeRouteUpdate(to, from, next) {
    const { id: roomId } = to.params
    this.fetchRoom(roomId)
    next()
  },
  methods: {
    async fetchRoom(roomId) {
      try {
        const { data, statusText } = await chatsAPI.getRoom({
          roomId
        })

        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        this.room = data.room
        this.roomImage = data.room.Product != null ? data.room.Product.Images[0].url : "https://dere.shikimori.one/system/clubs/main/2189.png?1576510376"
        this.roomMessages = data.room.Messages
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        Toast.fire({
          type: 'error',
          title: 'Невозможно получить информацию о диалоге, пожалуйста, попробуйте снова позже'
        })
      }
    },
    afterDeleteMessage(messageId) {
      this.roomMessages = this.roomMessages.filter(message => message.id !== messageId)
    },
    afterCreateMessage(payload) {
      const { messageId, roomId, text } = payload
      this.roomMessages.push({
        id: messageId,
        RoomId: roomId,
        User: {
          id: this.currentUser.id,
          name: this.currentUser.name,
          lastname: this.currentUser.lastname
        },
        text,
        createdAt: new Date(),
        UserId: this.currentUser.id
      })
    }
  }
}
</script>
