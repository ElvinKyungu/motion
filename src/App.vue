<script setup lang="ts">
import { ref, useTemplateRef, nextTick } from 'vue'
import { animate, spring } from 'motion'
import IconDate from './components/icons/IconDate.vue'
import IconChevronDown from './components/icons/IconChevronDown.vue'
import IconClose from './components/icons/IconClose.vue'

const isOpen = ref(false)
// Référence typée pour le date picker
const datePicker = useTemplateRef<HTMLDivElement | null>('datePicker')

async function toggleDatePicker() {
  isOpen.value = true
  await nextTick()
  if (isOpen.value && datePicker.value) {
    await animate(
      datePicker.value,
      { opacity: 1, transform: 'translateY(0)' },
      { duration: 0.2, easing: spring() }
    )
  }else if(datePicker.value && !isOpen.value) {
    animate(
      datePicker.value,
      { duration: 0.5, easing: spring() },
      { opacity: 0, transform: 'translateY(40px)' }
    )
  }
}
</script>

<template>
  <main class="h-screen flex flex-col justify-center items-center">
    <div class="border border-gray-300 p-4 rounded-3xl min-w-96 relative">
      <div>
        <input
          type="search"
          placeholder="What happening"
          class="border-none w-full outline-none"
        />
      </div>
      <div class="mt-10 flex items-center justify-end gap-4 p-5">
        <div
          ref="datePicker"
          v-if="isOpen"
          class="absolute top-10 right-0 p-4 rounded-lg opacity-0 w-full translate-y-10"
        >
          <div
            class="border rounded-full overflow-hidden h-10 relative flex items-center justify-between bg-slate-100"
          >
            <div class="bg-white w-[90%] rounded-full flex items-center justify-between">
              <div class="border-r h-10 w-full flex items-center justify-between p-2">
                <span class="text-sm">01, Jan 2025</span>
                <IconChevronDown />
              </div>
              <div class="h-10 w-full flex items-center justify-between p-2">
                <span class="text-sm">12:00 AM</span>
                <IconChevronDown />
              </div>
            </div>
            <button
              class="h-10 w-10 flex items-center justify-center"
              @click="isOpen= false"
            >
              <IconClose />
            </button>
          </div>
        </div>
        <div
          class="bg-black/10 cursor-pointer p-2 rounded-full"
          @click="toggleDatePicker"
        >
          <IconDate />
        </div>
        <div>
          <button
            class="flex text-center font-medium bg-black text-white rounded-full py-2 px-10"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
