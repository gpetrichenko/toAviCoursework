<template>
  <div class="tt-item">

      <div class="tt-col-description">
        <router-link
          :to="{ name: 'room', params: { id: room.id }}"
        ><h6 class="tt-title"><a >
          </a></h6></router-link>
      </div>
      <div class="tt-col-value hide-mobile">{{room.createdAt | fromDay }}</div>
  </div>



</template>

<script>

export default {
  props: {
    initialRoom: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeColor: 'white',
      room: this.initialRoom,
      isProcessing: false
    }
  }
  }
}
</script>
