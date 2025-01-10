<script setup lang="ts">
import { useTemplateRef, nextTick } from 'vue'
import { animate } from 'motion'
import IconDate from './components/icons/IconDate.vue'
import IconChevronDown from './components/icons/IconChevronDown.vue'
import IconClose from './components/icons/IconClose.vue'

// Référence typée pour le date picker
const datePicker = useTemplateRef<HTMLDivElement | null>('datePicker')

async function toggleDatePicker() {
  await nextTick()
  if (datePicker.value) {
    animateScheduleButton('90%', 1)
    await animate(
      datePicker.value,
      { opacity: 1, transform: 'translateY(0)' },
      { duration: 0.3, type: 'spring'}
    )
  }
}

// Fonction pour animer le bouton Schedule de gauche vers la droite
const animateScheduleButtonRef = useTemplateRef('animateScheduleButton')
async function animateScheduleButton(width: string = '0%', opacity: number = 0) {
  if (animateScheduleButtonRef.value) {
    await animate(
      animateScheduleButtonRef.value,
      { width: width, opacity: opacity },
      { duration: 0.7, type: 'spring' }
    )
  }
}

async function closeDatePicker() {
  if (datePicker.value) {
    animateScheduleButton('0%', 0)
    await animate(
      datePicker.value,
      { opacity: 0, transform: 'translateY(40px)' },
      { duration: 0.5, type: 'spring', bounce: 0.5 }
    ).then(() => {
    })
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
          class="absolute top-9 right-0 p-4 rounded-lg opacity-0 w-full translate-y-10"
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
              class="h-10 w-10 flex items-center justify-center cursor-pointer"
              @click="closeDatePicker"
            >
              <IconClose />
            </button>
          </div>
        </div>
        <div
          class="bg-black/10 cursor-pointer p-2 rounded-full z-50"
          @click="toggleDatePicker"
        >
          <IconDate />
        </div>
        <div class="w-full flex flex-col items-center center">
          <button
            class="flex text-center font-medium bg-black text-white rounded-full py-2 px-10"
          >
            Post
          </button>
          <button
            ref="animateScheduleButton"
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
