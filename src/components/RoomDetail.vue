<template>

  <div class="row">


    <div class="col-md-12 mb-3">
      <h1>test</h1>
    </div>

<!--
    <div class="col-lg-8">
      <p>{{ room.description }}</p>
      <router-link
        class="btn btn-primary btn-border mr-2"
        :to="{name: 'room-dashboard', params: {id: room.id }}"
      >Dashboard</router-link>

    </div> -->
  </div>
</template>

<script>
import { emptyImageFilter } from '@/utils/mixins'

export default {
  mixins: [emptyImageFilter],
  props: {
    initialRoom: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      room: this.initialRoom
    }
  },
  watch: {
    initialRoom(room) {
      this.room = {
        ...this.room,
        ...room
      }
    }
  }
}
</script>

<style scoped>
.col-lg-8 p,
.contact-info-wrap li,
.contact-info-wrap strong {
  font-family: serif;
  font-size: 17px;
}
</style>
