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
        <NuxtLink to="/" class="flex items-center gap-3 text-neutral-600 hover:text-white transition-colors duration-300 group">
          <span class="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-green-400 group-hover:text-green-400 transition-all duration-300 text-xs">←</span>
          <span class="text-xs font-bold tracking-[0.2em] uppercase">QR Studio</span>
        </NuxtLink>
        <span class="text-neutral-700 text-xs tracking-widest uppercase">Decoder</span>
      </nav>

      <section class="relative px-8 md:px-16 pt-32 pb-16">
        <div class="max-w-7xl mx-auto w-full">

          <p ref="taglineRef" class="text-green-400 text-xs font-bold tracking-[0.4em] uppercase mb-8 opacity-0">
            QR Code Decoder
          </p>

          <div class="mb-2">
            <h1 ref="line1Ref" class="text-[clamp(4rem,12vw,11rem)] font-black leading-[0.85] text-white tracking-tighter" style="transform: translateY(120%); opacity: 0;">
              Decode
            </h1>
          </div>
          <div class="mb-16">
            <h1 ref="line2Ref" class="text-[clamp(4rem,12vw,11rem)] font-black leading-[0.85] text-green-400 tracking-tighter" style="transform: translateY(120%); opacity: 0;">
              Any QR.
            </h1>
          </div>

        </div>
      </section>

      <section class="px-8 md:px-16 pb-32">
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div ref="uploadRef" style="opacity: 0; transform: translateY(40px);">
            <p class="text-neutral-600 text-xs tracking-[0.4em] uppercase mb-6">01 / Upload</p>
            <h2 class="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none mb-10">
              Drop your<br />QR image here
            </h2>

            <div
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="onDrop"
              @click="triggerUpload"
              :class="[
                'relative rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden',
                isDragging
                  ? 'border-green-400 bg-green-400/5'
                  : previewUrl
                    ? 'border-neutral-700 hover:border-neutral-500'
                    : 'border-neutral-800 hover:border-neutral-600'
              ]"
              style="min-height: 280px;"
            >
              <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange" />

              <div v-if="!previewUrl" class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div :class="['w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300', isDragging ? 'border-green-400 bg-green-400/10' : 'border-neutral-800']">
                  <svg class="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <p class="text-white font-bold text-lg mb-2">Drop your QR code here</p>
                <p class="text-neutral-600 text-sm">or click to browse</p>
                <p class="text-neutral-800 text-xs mt-4 tracking-widest uppercase">PNG · JPG · WebP</p>
              </div>

              <div v-else class="relative p-6 flex flex-col items-center gap-4">
                <img :src="previewUrl" alt="Uploaded QR" class="max-h-56 rounded-xl object-contain" />
                <div class="flex items-center gap-2 text-neutral-600 text-xs tracking-widest uppercase">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                  <span>Click to change</span>
                </div>
              </div>

              <div v-if="isDragging" class="absolute inset-0 flex items-center justify-center bg-green-400/5 rounded-2xl">
                <p class="text-green-400 font-black text-xl tracking-tight">Drop it!</p>
              </div>
            </div>

            <button
              @click="decode"
              :disabled="!previewUrl || decoding"
              class="w-full mt-4 py-5 rounded-xl font-black text-black bg-green-400 hover:bg-green-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 text-sm tracking-widest uppercase cursor-pointer"
            >
              {{ decoding ? 'Decoding...' : 'Decode QR Code' }}
            </button>

            <NuxtLink
              to="/"
              class="flex items-center justify-center gap-3 w-full mt-4 py-4 rounded-xl border border-neutral-800 text-neutral-600 hover:border-green-400 hover:text-green-400 transition-all duration-300 text-sm font-bold tracking-widest uppercase cursor-pointer group"
            >
              <span>Generate a QR Instead</span>
              <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </NuxtLink>
          </div>

          <div class="lg:pt-32">
            <p class="text-neutral-600 text-xs tracking-[0.4em] uppercase mb-6">02 / Result</p>

            <Transition name="scale">
              <div v-if="result && result !== ''" class="space-y-6">
                <h3 class="text-2xl font-black text-white tracking-tight">Decoded!</h3>

                <div class="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
                  <p class="text-xs font-bold tracking-[0.3em] text-neutral-600 uppercase mb-3">Content</p>
                  <p class="text-white font-bold text-lg break-all leading-relaxed">{{ result }}</p>
                </div>

                <div class="flex gap-3 flex-wrap">
                  <a
                    v-if="isUrl"
                    :href="result"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 rounded-full bg-green-400 text-black text-sm font-black tracking-wide hover:bg-green-300 transition-all duration-300 cursor-pointer"
                  >
                    Open URL →
                  </a>
                  <button
                    @click="copyResult"
                    class="px-6 py-3 rounded-full border border-neutral-700 text-neutral-400 text-sm font-bold tracking-wide hover:border-green-400 hover:text-green-400 transition-all duration-300 cursor-pointer"
                  >
                    {{ copied ? '✓ Copied' : 'Copy Text' }}
                  </button>
                  <button
                    @click="resetDecoder"
                    class="px-6 py-3 rounded-full border border-neutral-800 text-neutral-600 text-sm font-bold tracking-wide hover:border-neutral-700 hover:text-neutral-400 transition-all duration-300 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <div class="pt-4 border-t border-neutral-900">
                  <span class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase">
                    Type: {{ isUrl ? 'URL / Link' : 'Plain Text' }}
                  </span>
                </div>
              </div>

              <div v-else-if="result === ''" class="rounded-2xl bg-neutral-900 border border-red-900/50 p-8">
                <div class="w-12 h-12 rounded-xl bg-red-900/20 flex items-center justify-center mb-4">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <p class="text-white font-black text-lg mb-2">No QR code found</p>
                <p class="text-neutral-600 text-sm">Make sure the image is clear and contains a valid QR code.</p>
                <button @click="resetDecoder" class="mt-4 text-green-400 text-sm font-bold tracking-wide hover:underline cursor-pointer">
                  Try another image →
                </button>
              </div>

              <div v-else class="flex flex-col gap-4">
                <div class="rounded-2xl border border-dashed border-neutral-800 p-12 flex flex-col items-center justify-center text-center">
                  <div class="w-16 h-16 rounded-2xl border border-neutral-800 flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a.5.5 0 11-1 0 .5.5 0 011 0zM6 6h.01v.01H6V6z"/>
                    </svg>
                  </div>
                  <p class="text-neutral-700 text-sm tracking-widest uppercase">Result appears here</p>
                  <p class="text-neutral-800 text-xs mt-2">Upload a QR code to get started</p>
                </div>
              </div>
            </Transition>
          </div>

        </div>
      </section>

      <footer class="px-8 md:px-16 py-10 border-t border-neutral-900 flex items-center justify-between">
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
const uploadRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isDragging = ref(false)
const previewUrl = ref<string | null>(null)
const decoding = ref(false)
const result = ref<string | null>(null)
const copied = ref(false)

const isUrl = computed(() => {
  try { new URL(result.value || ''); return true } catch { return false }
})

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.to(taglineRef.value, { opacity: 1, duration: 0.8, delay: 0.3 })
    .to(line1Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=0.5')
    .to(line2Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
    .to(uploadRef.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
})

function triggerUpload() { fileInputRef.value?.click() }

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
  reader.onload = (e) => { previewUrl.value = e.target?.result as string }
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
  } catch {
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
.scale-enter-active, .scale-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>