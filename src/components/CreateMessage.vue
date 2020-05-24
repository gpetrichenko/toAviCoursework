<!-- <template>
  <form @submit.stop.prevent="handleSubmit">
  <div class="tt-message-border tt-wrapper-inner">
      <div class="pt-editor form-default">
          <h6 class="pt-title">Оставить сообщение:</h6>
           <div class="pt-row">
              <div class="col-left">

              </div>
              <div class="col-right tt-hidden-mobile">
              </div>
          </div>
          <div class="form-group">
              <textarea v-model="text" name="message" class="form-control" rows="3" placeholder="Текст..."></textarea>
          </div>
          <div class="pt-row">

              <div class="col-auto">
                  <button type="submit" class="btn btn-secondary btn-width-lg" :disabled="isProcessing">Оставить комментарий</button>
              </div>
          </div>
      </div>
  </div>
  </form>

</template>

<script>
import chatsAPI from '@/apis/chat'
import { Toast } from '@/utils/helpers'

export default {
  props: {
    themeId: {
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
            title: 'Вы ничего не написали в поле сообщений'
          })
          return
        }

        this.isProcessing = true
        const { data, statusText } = await chatsAPI.create({
          roomId: this.roomId,
          text: this.text
        })

        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(statusText)
        }

        this.$emit('after-create-message', {
          messageId: data.messageId,
          roomId: this.roomId,
          text: this.text

        })
        this.isProcessing = false
        this.text = ''
      } catch (error) {
        this.isProcessing = false
        Toast.fire({
          type: 'error',
          title: 'Невозможно отправить сообщение, повторите попытку позже.'
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
</style> -->



<template>
  <form @submit.stop.prevent="handleSubmit">
    <div class="form-group mb-4">
      <label for="text">Оставьте сообщение: </label>
      <textarea v-model="text" class="form-control" rows="3" name="text" style="resize: none;"/>
    </div>

    <div class="d-flex align-items-center justify-content-between">


      <button type="submit" class="btn btn-primary mr-0 mb-4" :disabled="isProcessing">Отправить</button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import messagesAPI from '@/apis/messages'
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
  computed: {
    ...mapState(['currentUser'])
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
        const { data, statusText } = await messagesAPI.create({
          roomId: this.roomId,
          text: this.text
        })

        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(statusText)
        }
        this.$emit('after-create-message', {
          User: {
            id: this.currentUser.id,
            name: this.currentUser.name,
            lastname: this.currentUser.lastname
          },
          messageId: data.messageId,
          roomId: this.roomId,
          text: this.text,
          UserId: this.currentUser.id
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
