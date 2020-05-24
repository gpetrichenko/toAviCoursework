<template>
  <form @submit.stop.prevent="handleSubmit">
    <div class="form-group mb-4">
      <label for="text">Оставьте сообщение: </label>
      <textarea v-model="text" class="form-control" rows="3" name="text" />
    </div>

    <div class="d-flex align-items-center justify-content-between">
      <a href="#" @click="$router.back()">Назад</a>

      <button type="submit" class="btn btn-primary mr-0" :disabled="isProcessing">Submit</button>
    </div>
  </form>
</template>

<script>
import commentsAPI from '@/apis/comments'
import { Toast } from '@/utils/helpers'

export default {
  props: {
    roomId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      text: '',
      isProcessing: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.text) {
          Toast.fire({
            type: 'warning',
            title: 'Вы не заполнили поле сообщения'
          })
          return
        }

        this.isProcessing = true
        const { data, statusText } = await commentsAPI.create({
          roomId: this.roomId,
          text: this.text
        })

        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(statusText)
        }
        this.$emit('after-create-comment', {
          commentId: data.commentId,
          roomId: this.roomId,
          text: this.text
        })
        this.isProcessing = false
        this.text = ''
      } catch (error) {
        this.isProcessing = false
        Toast.fire({
          type: 'error',
          title: 'Не получилось отправить сообщение, пожалуйста, попробуйте снова позже'
        })
      }
    }
  }
}
</script>

<style scoped>
.form-group {
  margin: 21px 0 8px;
}
</style>
