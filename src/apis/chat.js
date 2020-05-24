import { apiHelper } from '../utils/helpers'

export default {

  addRoom({ productId }) {
    return apiHelper.post(`/products/${productId}/room`, null)
  },

  getRooms() {
    return apiHelper.get(`/users/rooms/`, null)
  },
  getRoom({ roomId }) {
    return apiHelper.get(`/users/rooms/${roomId}`)
  },
  create({ roomId, text }) {
    return apiHelper.post('/comments', { roomId, text })
  }
}
