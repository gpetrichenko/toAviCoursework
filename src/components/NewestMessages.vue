<template>
  <div class="card">
    <div class="card-header">Последние комментарии</div>

    <div class="card-body">
      <div v-for="message in messages" :key="message.id">
        <h4>
          <router-link
            :to="{ name: 'room', params: {id: message.Room.id}}"
          >{{ message.Room.name }}</router-link>
        </h4>
        <router-link :to="{ name: 'user', params: {id: message.User.id}}">{{ message.User.name }} </router-link>

        <p>{{ message.text }}</p>
        <router-link :to="{ name: 'user', params: {id: message.User.id}}">{{ message.User.name }} {{ message.User.image }}</router-link>
        at {{ message.createdAt | fromNow }}
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import { fromNowFilter } from '@/utils/mixins'

export default {
  mixins: [fromNowFilter],
  props: {
    messages: {
      type: Array,
      required: true
    }
  }
}
</script>
