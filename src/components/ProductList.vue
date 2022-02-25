<script>
import axios from "axios";
import { NSpace, NPageHeader, NDataTable } from "naive-ui";

export default {
  components: {
    NSpace,
    NPageHeader,
    NDataTable,
  },
  data() {
    return {
      products: [],
      columns: [
        {
          title: "No",
          key: "no",
          width: 100,
          render: (_, index) => {
            return (
              index + (this.pagination.page - 1) * this.pagination.pageSize + 1
            );
          },
        },
        { title: "Name", key: "name" },
        { title: "Price", key: "price" },
      ],
      pagination: {
        page: 1,
        pageSize: 5,
        itemCount: 0,
        onChange: (page) => {
          this.$router.push({ query: { ...this.$route.query, page } });
        },
      },
      isLoading: false,
    };
  },
  watch: {
    "$route.query": {
      immediate: true,
      deep: true,
      handler() {
        this.pagination.page = Number(this.$route.query.page || 1);
      },
    },
    "pagination.page": {
      immediate: true,
      handler: "fetchProducts",
    },
  },
  methods: {
    async fetchProducts() {
      try {
        this.status = "loading";
        const response = await axios.get("http://localhost:8000/products", {
          params: {
            _page: this.pagination.page,
            _limit: this.pagination.pageSize,
          },
        });

        if (response && response.data) {
          this.products = response.data;
        }
        this.pagination.itemCount = Number(response.headers["x-total-count"]);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
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
