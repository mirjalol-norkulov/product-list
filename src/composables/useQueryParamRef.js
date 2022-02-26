import { computed } from 'vue';
import { useRouter, useRoute } from "vue-router";

export const useQueryParamRef = (key, defaultValue) => {
  const router = useRouter();
  const route = useRoute();

  return computed({
    get() {
      return Number(route.query[key] || defaultValue)
    },
    set(value) {
      router.push({ query: { ...route.query, [key]: value } })
    }
  });
}