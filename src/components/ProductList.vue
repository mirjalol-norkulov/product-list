<script setup>
import axios from "axios";
import { NSpace, NPageHeader, NDataTable } from "naive-ui";
import { ref, reactive, watch, computed } from "vue";
import { useQueryParamRef } from "~/composables/useQueryParamRef";

const products = ref([]);
const isLoading = ref(false);

const pagination = reactive({
  page: useQueryParamRef("page", 1),
  pageSize: useQueryParamRef("limit", 5),
  itemCount: 0,
  onChange: (page) => {
    pagination.page = page;
  },
});
const columns = [
  {
    title: "No",
    key: "no",
    width: 100,
    render: (_, index) => {
      return index + (pagination.page - 1) * pagination.pageSize + 1;
    },
  },
  { title: "Name", key: "name" },
  { title: "Price", key: "price" },
];

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get("http://localhost:8000/products", {
      params: {
        _page: pagination.page,
        _limit: pagination.pageSize,
      },
    });

    if (response && response.data) {
      products.value = response.data;
    }
    pagination.itemCount = Number(response.headers["x-total-count"]);
  } finally {
    isLoading.value = false;
  }
};
watch(() => pagination.page, fetchProducts, { immediate: true });
</script>

<template>
  <main class="product-list">
    <NSpace vertical>
      <NPageHeader>
        <template #title> Products </template>
      </NPageHeader>
      <NDataTable
        class="product-list__table"
        :row-key="(product) => product.id"
        remote
        table-layout="fixed"
        :loading="isLoading"
        :columns="columns"
        :data="products"
        :pagination="pagination"
      />
    </NSpace>
  </main>
</template>

<style lang="scss">
.product-list {
  padding: 1rem;
  &__table {
    min-height: 326px;
  }
}
</style>
