<template>
  <main>
    {{room.UserId}}
  </main>
</template>

<script>
// import { emptyImageFilter, fromNowFilter } from '@/utils/mixins'
export default {

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
