<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { Currency } from '../types/Currency'
import axios from 'axios'
import { animate } from 'motion'
import IconChevronDown from './icons/IconChevronDown.vue'
import NumberFlow from '@number-flow/vue'
import { useCycle } from '@/composables/useCycle'
import { useRootClick } from '@/composables/useRootClick'

const currencies: Currency[] = [
  { code: 'USD', name: 'Dollar américain', flag: 'US', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: 'EU', symbol: '€' },
  { code: 'CDF', name: 'Franc congolais', flag: 'CD', symbol: 'FC' },
  { code: 'XAF', name: 'Franc CFA', flag: 'CM', symbol: 'FCFA' },
  { code: 'AUD', name: 'Dollar australien', flag: 'AU', symbol: '$' },
]

const amount = ref(1)
const fromCurrency = ref(currencies[0])
const toCurrency = ref(currencies[1])
const exchangeRate = ref(0)
const loading = ref(false)
const state = reactive({
  fromDropdownOpen: false,
  toDropdownOpen: false,
})

const convertedAmount = computed(() => {
  return (amount.value * exchangeRate.value).toFixed(2)
})

async function getExchangeRate() {
  loading.value = true
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency.value.code}`,
    )
    exchangeRate.value = response.data.rates[toCurrency.value.code]
  } catch (error) {
    console.error('Erreur lors de la récupération du taux de change:', error)
  } finally {
    loading.value = false
  }
}

async function updateRate() {
  await getExchangeRate()
}

watch([fromCurrency, toCurrency], () => {
  updateRate()
})

onMounted(() => {
  updateRate()
})

const toggleDropdown = (type: 'from' | 'to') => {
  if (type === 'from') state.fromDropdownOpen = !state.fromDropdownOpen
  if (type === 'to') state.toDropdownOpen = !state.toDropdownOpen

  const dropdown = document.querySelector(`.${type}-dropdown-list`) as HTMLElement
  if (dropdown && state[`${type}DropdownOpen`]) {
    animate(
      dropdown,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.5, easing: 'spring(1, 80, 10, 0)' },
    )
  }
}

const closeDropdownWithAnimation = (type: 'from' | 'to') => {
  const dropdown = document.querySelector(`.${type}-dropdown-list`) as HTMLElement
  if (dropdown && state[`${type}DropdownOpen`]) {
    animate(dropdown, { opacity: [1, 0], y: [0, 20] }, { duration: 0.4 }).then(() => {
      state[`${type}DropdownOpen`] = false
    })
  }
}

const selectCurrency = (type: 'from' | 'to', currency: Currency) => {
  if (type === 'from') fromCurrency.value = currency
  if (type === 'to') toCurrency.value = currency
  closeDropdownWithAnimation(type)
}


const { value, next } = useCycle([543, 12000, -3200]);
useRootClick(next);
</script>

<template>
  <div class="w-[42rem] mx-auto p-6 bg-white rounded-lg shadow-lg">
    <NumberFlow :value :trend="0" :format="{ notation: 'compact' }" />
    <h1 class="text-3xl font-bold text-center mb-8">Convertisseur de Devises</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="col-span-full">
        <label class="block text-sm font-medium text-gray-700 mb-2">Montant</label>
        <input
          type="number"
          v-model="amount"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="0"
        />
      </div>
      <div class="relative" ref="from">
        <label class="block text-sm font-medium text-gray-700 mb-2">De</label>
        <button
          class="w-full md:w-[18rem] gap-4 p-3 border border-gray-300 rounded-md bg-white flex justify-between items-center"
          @click="toggleDropdown('from')"
        >
          <span class="flex items-center gap-2">
            <span :class="`fi fi-${fromCurrency.flag.toLowerCase()}`"></span>
            {{ fromCurrency.code }} - {{ fromCurrency.name }}
          </span>
          <IconChevronDown class="w-5 h-5" />
        </button>
        <ul
          v-show="state.fromDropdownOpen"
          class="from-dropdown-list z-20 absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden"
        >
          <li
            v-for="currency in currencies"
            :key="currency.code"
            @click="selectCurrency('from', currency)"
            class="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
          >
            <span :class="`fi fi-${currency.flag.toLowerCase()}`"></span>
            {{ currency.code }} - {{ currency.name }}
          </li>
        </ul>
      </div>
      <div class="relative" ref="to">
        <label class="block text-sm font-medium text-gray-700 mb-2">Vers</label>
        <button
          class="w-full md:w-[18rem] gap-4 p-3 border border-gray-300 rounded-md bg-white flex justify-between items-center"
          @click="toggleDropdown('to')"
        >
          <span class="flex items-center gap-2">
            <span :class="`fi fi-${toCurrency.flag.toLowerCase()}`"></span>
            {{ toCurrency.code }} - {{ toCurrency.name }}
          </span>
          <IconChevronDown class="w-5 h-5" />
        </button>
        <ul
          v-show="state.toDropdownOpen"
          class="to-dropdown-list absolute z-20 left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden"
        >
          <li
            v-for="currency in currencies"
            :key="currency.code"
            @click="selectCurrency('to', currency)"
            class="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
          >
            <span :class="`fi fi-${currency.flag.toLowerCase()}`"></span>
            {{ currency.code }} - {{ currency.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
      <div v-if="loading" class="text-center">
        <p class="text-gray-600">Chargement...</p>
      </div>
      <div v-else class="text-center">
        <p class="text-xl flex items-center justify-center gap-2">
          <span :class="`fi fi-${fromCurrency.flag.toLowerCase()}`"></span>
          {{ amount }} {{ fromCurrency.symbol }} =
          <span :class="`fi fi-${toCurrency.flag.toLowerCase()}`"></span>
          {{ convertedAmount }} {{ toCurrency.symbol }}
        </p>
        <p class="text-sm text-gray-600 mt-2">
          1 {{ fromCurrency.code }} = {{ exchangeRate }} {{ toCurrency.code }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fi {
  width: 1.5em;
  height: 1em;
  display: inline-block;
  margin-right: 0.5em;
  vertical-align: middle;
}
</style>
