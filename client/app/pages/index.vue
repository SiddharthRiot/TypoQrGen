<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-2xl mx-auto px-4 py-16">
      
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          QR Studio
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          Generate QR codes for text, links, images & videos
        </p>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8">
        
        <div class="flex gap-2 mb-6">
          <UButton
            v-for="t in types"
            :key="t.value"
            :variant="selectedType === t.value ? 'solid' : 'ghost'"
            size="sm"
            @click="selectedType = t.value"
          >
            {{ t.label }}
          </UButton>
        </div>

        <UInput
          v-model="label"
          placeholder="Label (optional)"
          class="mb-4"
        />

        <UTextarea
          v-model="content"
          :placeholder="placeholder"
          :rows="4"
          class="mb-6"
        />

        <UButton
          block
          size="lg"
          :loading="loading"
          @click="generate"
        >
          Generate QR Code
        </UButton>
      </div>

      <div v-if="qrResult" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center gap-4">
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
          {{ qrResult.label || qrResult.type }}
        </p>
        <img :src="qrResult.qrDataUrl" alt="QR Code" class="w-64 h-64" />
        <UButton variant="ghost" size="sm" @click="download">
          Download PNG
        </UButton>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const API = config.public.apiBase

const types = [
  { label: 'Text', value: 'text' },
  { label: 'Link', value: 'link' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' }
]

const selectedType = ref('text')
const content = ref('')
const label = ref('')
const loading = ref(false)
const qrResult = ref<any>(null)

const placeholder = computed(() => {
  const map: Record<string, string> = {
    text: 'Enter your text...',
    link: 'https://example.com',
    image: 'Paste image URL...',
    video: 'Paste video URL...'
  }
  return map[selectedType.value]
})

async function generate() {
  if (!content.value.trim()) return
  loading.value = true
  try {
    const res = await $fetch(`${API}/api/qr/generate`, {
      method: 'POST',
      body: {
        type: selectedType.value,
        content: content.value,
        label: label.value
      }
    })
    qrResult.value = (res as any).data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function download() {
  if (!qrResult.value) return
  const a = document.createElement('a')
  a.href = qrResult.value.qrDataUrl
  a.download = `qr-${Date.now()}.png`
  a.click()
}
</script>