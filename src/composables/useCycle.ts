import { ref, computed } from 'vue';

export function useCycle<T>(options: T[]) {
  const index = ref(0);

  const next = () => {
    index.value = (index.value + 1) % options.length;
  };

  const value = computed(() => options[index.value]);

  return { value, next };
}