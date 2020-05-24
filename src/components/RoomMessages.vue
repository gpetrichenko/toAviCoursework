<template>
  <div>


    <div v-for="message in RoomMessages" :key="message.id">
      <div class="mesg ml-2 mt-2 mr-2 mb-2">
        <div>
          <template v-if="currentUser.id != message.UserId ">
            <div class="incoming_msg">
              <div class="received_msg">
                <div class="received_withd_msg">
                  {{ message.User.name }}
                  <p>{{ message.text }}</p>
                  <span class="time_date"> {{ message.createdAt | fromNow }}</span></div>
                </div>
              </div>
            </template>
            <template v-else >
              <div class="outgoing_msg">
                <div class="sent_msg">
                  {{ message.User.name }}
                  <p>{{ message.text }}</p>
                  <span class="time_date"> {{ message.createdAt | fromNow }}</span> </div>
                </div>
              </template>
            </div>
          </div>
          <a ></a>
        </div>
      </div>
    </template>

<script>
import { mapState } from 'vuex'
import { fromNowFilter } from '@/utils/mixins'
export default {
  mixins: [fromNowFilter],
  props: {
    RoomMessages: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<style scoped>
h2.my-4 {
  margin-bottom: 1rem !important;
  font-size: 18px;
}

h3 {
  margin-bottom: 3px;
  line-height: 1.3;
}

.blockquote-footer {
  font-size: 12.5px;
}
</style>
