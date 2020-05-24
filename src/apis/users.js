import { apiHelper } from './../utils/helpers'

export default {
  products: {
    get({ page }) {
      const searchParams = new URLSearchParams({page})
      return apiHelper.get(`/users/products?${searchParams.toString()}`);
    },
    post({ formData, images }) {

      for(let i = 0; i < images.length; i++){
        formData.append("images", images[i]);
      }

      return apiHelper.post("/users/products", formData);
    },
    put({ id, formData }) {

      return apiHelper.put(`/users/products/${id}`, formData)

    },
    getStatus({ id }) {
      return apiHelper.get(`/users/products/${id}/stocks`);
    },
    getStatusDatail({ id, stock_id }) {
      return apiHelper.get(`/users/products/${id}/stocks/${stock_id}`);
    },
    postStatus({ productId }) {
      return apiHelper.post(`/users/products/${productId}/stocks`);
    },
    putStatus({ id, stock_id, stock }) {
      return apiHelper.put(`/users/products/${id}/stocks/${stock_id}`, {
        stock
      });
    },
    deleteStatus({ id, stock_id }) {
      return apiHelper.delete(`/users/products/${id}/stocks/${stock_id}`);
    },
    deleteImage(id) {
      return apiHelper.delete(`/users/image/${id}`);
    },
    getProductDetail({ id }) {
      return apiHelper.get(`/users/products/${id}`);
    },
    delete({ productId }) {
      return apiHelper.delete(`/users/products/${productId}`);
    }
  },
  categories: {
    get() {
      return apiHelper.get("/admins/categories");
    }
  },

  getCurrentUser() {
    return apiHelper.get(`/get_current_user`)
  },
  getUserOrders() {
    return apiHelper.get(`/users/orders`)
  },
  getUserProducts({ page }) {
    const searchParams = new URLSearchParams({page})
    return apiHelper.get(`/users/products?${searchParams.toString()}`);
  },
  getUserOrder({ orderId }) {
    return apiHelper.get(`/users/orders/${orderId}`)
  },
  getUserFavorite() {
    return apiHelper.get(`/users/wishlist`)
  },
  postPasswordChange({ formData }) {
    return apiHelper.post(`/users/password_change`, formData)
  },
  postPasswordForget({ formData }) {
    return apiHelper.post(`/users/password_forget`, formData)
  },
  getResetPassword({ tokenId, token }) {
    return apiHelper.get(`/users/password_reset/${tokenId}/${token}`)
  },
  postResetPassword({ formData }) {
    return apiHelper.post(`/users/password_reset`, formData)
  },
  putUser({ formData }) {
    return apiHelper.put(`/users/edit`, formData)
  }
}
