import { apiHelper } from "./../utils/helpers";

export default {
  products: {
    get({ page }) {
      const searchParams = new URLSearchParams({page})
      return apiHelper.get(`/moderators/products?${searchParams.toString()}`);
    },
    post({ formData, images }) {

      for(let i = 0; i < images.length; i++){
        formData.append("images", images[i]);
      }

      return apiHelper.post("/moderators/products", formData);
    },
    put({ id, formData }) {

      return apiHelper.put(`/moderators/products/${id}`, formData)

    },
    deleteImage(id) {
      return apiHelper.delete(`/moderators/image/${id}`);
    },
    getProductDetail({ id }) {
      return apiHelper.get(`/moderators/products/${id}`);
    },
    delete({ productId }) {
      return apiHelper.delete(`/moderators/products/${productId}`);
    }
  },
  categories: {
    get() {
      return apiHelper.get("/admins/categories");
    }
  }
};
