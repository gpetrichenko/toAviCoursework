<template>
  <div>
    <h2 class="my-4">Напишите сообщение：</h2>

    <div v-for="comment in RoomComments" :key="comment.id">
      <blockquote class="blockquote mb-0">
        <button
          v-if="currentUser.isAdmin"
          type="button"
          class="btn btn-danger float-right"
          @click.stop.prevent="deleteComment(comment.id)"
        >Удалить</button>

        <h3>
          <!-- <router-link :to="{ name: 'user', params: {id: comment.User.id}}">{{ comment.User.name }}</router-link> -->
          {{ comment.User.name }} {{ comment.User.lastname }}
        </h3>
        <p>{{ comment.text }}</p>

        <footer class="blockquote-footer">{{ comment.createdAt | fromNow }}</footer>
      </blockquote>
      <hr />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import commentsAPI from '@/apis/comments'
import { fromNowFilter } from '@/utils/mixins'
import { Toast } from '@/utils/helpers'

export default {
  mixins: [fromNowFilter],
  props: {
    RoomComments: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    async deleteComment(commentId) {
      try {
        const { data, statusText } = await commentsAPI.delete({
          commentId
        })

        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(statusText)
        }

        this.$emit('after-delete-comment', commentId)
        Toast.fire({
          type: 'success',
          title: 'Сообщение успешно удалено'
        })
      } catch (error) {
        Toast.fire({
          type: 'error',
          title: 'Невозможно удалить сообщение, пожалуйста, попробуйте снова позже'
        })
      }
    }
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
