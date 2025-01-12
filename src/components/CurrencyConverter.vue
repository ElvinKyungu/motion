<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Currency } from '../types/Currency'
import axios from 'axios'

const currencies: Currency[] = [
  { code: 'USD', name: 'Dollar américain', flag: 'US', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: 'EU', symbol: '€' },
  { code: 'CDF', name: 'Franc congolais', flag: 'CD', symbol: 'FC' },
  { code: 'XAF', name: 'Franc CFA', flag: 'CM', symbol: 'FCFA' },
  { code: 'GBP', name: 'Livre sterling', flag: 'GB', symbol: '£' },
  { code: 'JPY', name: 'Yen japonais', flag: 'JP', symbol: '¥' },
  { code: 'CNY', name: 'Yuan chinois', flag: 'CN', symbol: '¥' },
  { code: 'CAD', name: 'Dollar canadien', flag: 'CA', symbol: '$' },
  { code: 'AUD', name: 'Dollar australien', flag: 'AU', symbol: '$' },
  { code: 'CHF', name: 'Franc suisse', flag: 'CH', symbol: 'CHF' },
]

const amount = ref(1)
const fromCurrency = ref(currencies[0])
const toCurrency = ref(currencies[2])
const exchangeRate = ref(0)
const loading = ref(false)

const convertedAmount = computed(() => {
  return (amount.value * exchangeRate.value).toFixed(2)
})

async function getExchangeRate() {
  loading.value = true;
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value.code}`)
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
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8">Convertisseur de Devises</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Montant -->
      <div class="col-span-full">
        <label class="block text-sm font-medium text-gray-700 mb-2">Montant</label>
        <input
          type="number"
          v-model="amount"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="0"
        >
      </div>

      <!-- Devise de départ -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">De</label>
        <select
          v-model="fromCurrency"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="currency in currencies" :key="currency.code" :value="currency" class="flex items-center gap-2">
            <div class="flex items-center gap-2">
              <span :class="`fi fi-${currency.flag.toLowerCase()}`"></span>
              {{ currency.code }} - {{ currency.name }}
            </div>
          </option>
        </select>
      </div>

      <!-- Devise d'arrivée -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Vers</label>
        <select
          v-model="toCurrency"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="currency in currencies" :key="currency.code" :value="currency" class="flex items-center gap-2">
            <div class="flex items-center gap-2">
              <span :class="`fi fi-${currency.flag.toLowerCase()}`"></span>
              {{ currency.code }} - {{ currency.name }}
            </div>
          </option>
        </select>
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