import { apiHelper } from "./../utils/helpers";

export default {
  categories: {
    get() {
      return apiHelper.get("/admins/categories");
    },
    create({ category }) {
      return apiHelper.post("/admins/categories", { category });
    },

    update({ categoryId, category }) {
      return apiHelper.put(`/admins/categories/${categoryId}`, { category });
    },
    delete({ categoryId }) {
      return apiHelper.delete(`/admins/categories/${categoryId}`);
    }
  },
  users: {
    get({ page }) {
      const searchParams = new URLSearchParams({page})
      return apiHelper.get(`/admins/users?${searchParams}`);
    },
    putUser (profile) {
      return apiHelper.put(`/admin/user`, profile)
    },
  },
  products: {
    get({ page }) {
      const searchParams = new URLSearchParams({page})
      return apiHelper.get(`/admins/products?${searchParams.toString()}`);
    },
    post({ formData, images }) {

      for(let i = 0; i < images.length; i++){
        formData.append("images", images[i]);
      }

      return apiHelper.post("/admins/products", formData);
    },
    put({ id, formData }) {

      return apiHelper.put(`/admins/products/${id}`, formData)

    },
    deleteImage(id) {
      return apiHelper.delete(`/admins/image/${id}`);
    },
    getProductDetail({ id }) {
      return apiHelper.get(`/admins/products/${id}`);
    }
  }
};
