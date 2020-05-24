import { apiHelper } from '@/utils/helpers'

export default {
  create({ roomId, text }) {
    return apiHelper.post('/messages', { roomId, text })
  },
  delete({ commentId }) {
    return apiHelper.delete(`/messages/${commentId}`)
  }
}
