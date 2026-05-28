<template>
  <div>
    <Head>
      <Title>QR Decoder Scan & Decode Any QR Code | QR Studio</Title>
      <Meta name="description" content="Upload any QR code image and decode its content instantly. Free QR code decoder by QR Studio." />
      <Meta name="robots" content="index, follow" />
    </Head>

    <main class="min-h-screen bg-[#080808]">

      <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 200px;">
      </div>

      <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <NuxtLink to="/" class="text-white font-black text-sm tracking-[0.2em] uppercase hover:text-green-400 transition-colors">
          ← QR Studio
        </NuxtLink>
        <span class="text-neutral-600 text-xs tracking-widest uppercase">Decoder</span>
      </nav>

      <section class="relative min-h-screen flex flex-col justify-center px-8 md:px-16 pt-24">
        <div class="max-w-7xl mx-auto w-full">

          <p ref="taglineRef" class="text-green-400 text-xs font-bold tracking-[0.4em] uppercase mb-8 opacity-0">
            QR Code Decoder
          </p>

          <div class="overflow-hidden mb-4">
            <h1 ref="line1Ref" class="text-[clamp(4rem,12vw,11rem)] font-black leading-[0.85] text-white tracking-tighter" style="transform: translateY(120%); opacity: 0;">
              Decode
            </h1>
          </div>
          <div class="overflow-hidden mb-16">
            <h1 ref="line2Ref" class="text-[clamp(4rem,12vw,11rem)] font-black leading-[0.85] tracking-tighter" style="transform: translateY(120%); opacity: 0; color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,0.2);">
              Any QR.
            </h1>
          </div>

          <div
            ref="dropRef"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerUpload"
            :class="[
              'relative rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-16 mb-8',
              isDragging ? 'border-green-400 bg-green-400/5' : 'border-neutral-800 hover:border-neutral-600'
            ]"
          >
            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange" />

            <div v-if="!previewUrl" class="text-center">
              <div class="w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl">↑</span>
              </div>
              <p class="text-white font-bold text-lg mb-2">Drop your QR code here</p>
              <p class="text-neutral-600 text-sm">or click to browse PNG, JPG, WebP supported</p>
            </div>

            <div v-else class="flex flex-col items-center gap-6">
              <img :src="previewUrl" alt="Uploaded QR" class="max-w-xs max-h-64 rounded-2xl object-contain" />
              <p class="text-neutral-600 text-xs tracking-widest uppercase">Click to change image</p>
            </div>
          </div>

          <button
            @click="decode"
            :disabled="!previewUrl || decoding"
            class="w-full py-5 rounded-xl font-black text-black bg-green-400 hover:bg-green-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 text-sm tracking-widest uppercase mb-8"
          >
            {{ decoding ? 'Decoding...' : 'Decode QR Code' }}
          </button>

          <Transition name="scale">
            <div v-if="result !== null" class="rounded-3xl border border-neutral-800 bg-neutral-900 p-10">
              <p class="text-neutral-600 text-xs tracking-[0.4em] uppercase mb-4">Decoded Content</p>

              <div v-if="result === ''" class="text-red-400 font-bold text-lg">
                No QR code found in this image.
              </div>

              <div v-else>
                <p class="text-white font-black text-2xl tracking-tight break-all mb-6">{{ result }}</p>

                <div class="flex gap-4 flex-wrap">
                  <a
                    v-if="isUrl"
                    :href="result"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-8 py-3 rounded-full bg-green-400 text-black text-sm font-black tracking-wide hover:bg-green-300 transition-all duration-300"
                  >
                    Open URL →
                  </a>
                  <button
                    @click="copyResult"
                    class="px-8 py-3 rounded-full border border-neutral-700 text-neutral-400 text-sm font-bold tracking-wide hover:border-neutral-500 hover:text-white transition-all duration-300"
                  >
                    {{ copied ? 'Copied!' : 'Copy Text' }}
                  </button>
                  <button
                    @click="resetDecoder"
                    class="px-8 py-3 rounded-full border border-neutral-800 text-neutral-600 text-sm font-bold tracking-wide hover:border-neutral-700 hover:text-neutral-400 transition-all duration-300"
                  >
                    Decode Another
                  </button>
                </div>
              </div>
            </div>
          </Transition>

        </div>
      </section>

      <footer class="px-8 md:px-16 py-10 border-t border-neutral-900 flex items-center justify-between mt-24">
        <span class="text-white font-black text-sm tracking-[0.2em] uppercase">QR Studio</span>
        <span class="text-neutral-800 text-xs">© {{ new Date().getFullYear() }} · Nuxt + MongoDB</span>
      </footer>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

useSeoMeta({
  title: 'QR Decoder Decode Any QR Code Free | QR Studio',
  description: 'Upload any QR code image and instantly decode its content. Free, fast, no signup required.',
  twitterCard: 'summary_large_image'
})

const config = useRuntimeConfig()
const API = config.public.apiBase

const taglineRef = ref<HTMLElement | null>(null)
const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const dropRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const previewUrl = ref<string | null>(null)
const decoding = ref(false)
const result = ref<string | null>(null)
const copied = ref(false)

const isUrl = computed(() => {
  try {
    new URL(result.value || '')
    return true
  } catch {
    return false
  }
})

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.to(taglineRef.value, { opacity: 1, duration: 0.8, delay: 0.3 })
    .to(line1Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=0.5')
    .to(line2Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
})

function triggerUpload() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) loadFile(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) loadFile(file)
}

function loadFile(file: File) {
  result.value = null
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function decode() {
  if (!previewUrl.value) return
  decoding.value = true
  try {
    const res = await $fetch(`${API}/api/qr/decode`, {
      method: 'POST',
      body: { imageBase64: previewUrl.value }
    })
    result.value = (res as any).data
  } catch (e: any) {
    result.value = ''
  } finally {
    decoding.value = false
  }
}

async function copyResult() {
  if (!result.value) return
  await navigator.clipboard.writeText(result.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function resetDecoder() {
  previewUrl.value = null
  result.value = null
  copied.value = false
  if (fileInputRef.value) fileInputRef.value.value = ''
}
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>