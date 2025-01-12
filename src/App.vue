<script setup lang="ts">
import { ref, computed, useTemplateRef, nextTick } from 'vue'
import { animate } from 'motion'
import IconDate from './components/icons/IconDate.vue'
import IconChevronDown from './components/icons/IconChevronDown.vue'
import IconClose from './components/icons/IconClose.vue'
import "vue-select/dist/vue-select.css";
import "flag-icons/css/flag-icons.min.css";
import CurrencyConverter from '@/components/CurrencyConverter.vue'

const datePicker = useTemplateRef<HTMLDivElement | null>('datePicker')
const scheduleButton = useTemplateRef<HTMLDivElement | null>('scheduleButton')

async function animateElement(
  element: HTMLElement | null,
  keyframes: Record<string, any>,
  options: Record<string, any>
) {
  if (element) {
    await animate(element, keyframes, options)
  }
}

function updateScheduleButton(width = '0%', opacity = 0, duration = 0.7) {
  animateElement(scheduleButton.value, { width, opacity }, { duration: duration, type: 'spring' })
}

async function toggleDatePicker() {
  await nextTick()
  if (datePicker.value) {
    updateScheduleButton('90%', 1, 0.7)
    animateElement(
      datePicker.value,
      { opacity: 1, transform: 'translateY(0)' },
      { duration: 0.3, type: 'spring' }
    )
  }
}

// Fermeture du date picker
function closeDatePicker() {
  nextTick()
  if (datePicker.value) {
    updateScheduleButton('0%', 0, 1)
    animateElement(
      datePicker.value,
      { opacity: 0, transform: 'translateY(40px)' },
      { duration: 0.5, type: 'spring', bounce: 0.5 }
    )
  }
}
</script>

<template>
  <main class="h-screen flex flex-col justify-center items-center">
    <CurrencyConverter />

    <div class="border mt-10 border-gray-300 p-4 rounded-3xl min-w-96 relative">
      <div>
        <input
          type="search"
          placeholder="What happening"
          class="border-none w-full outline-none"
        />
      </div>
      <div class="mt-10 flex items-center justify-end gap-4 p-5">
        <!-- Date Picker -->
        <div
          ref="datePicker"
          class="absolute top-9 right-0 p-4 rounded-lg opacity-0 w-full translate-y-10"
        >
          <div class="border rounded-full overflow-hidden h-10 relative flex items-center justify-between bg-slate-100">
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
              class="h-10 w-10 flex items-center justify-center cursor-pointer"
              @click="closeDatePicker"
            >
              <IconClose />
            </button>
          </div>
        </div>

        <!-- Icon Date -->
        <div
          class="bg-black/10 cursor-pointer p-2 rounded-full z-50"
          @click="toggleDatePicker"
        >
          <IconDate />
        </div>

        <!-- Schedule Button -->
        <div class="w-full flex flex-col items-center center">
          <button class="flex text-center font-medium bg-black text-white rounded-full py-2 px-10">
            Post
          </button>
          <button
            ref="scheduleButton"
            class="bg-black rounded-full absolute opacity-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center px-5 py-2 text-white w-0"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
