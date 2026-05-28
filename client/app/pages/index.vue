<template>
  <div>
    <Head>
      <Title>QR Studio Generate QR Codes for Text, Links, Images & Videos</Title>
      <Meta name="description" content="Free QR code generator. Create QR codes for text, URLs, images, and videos instantly." />
      <Meta name="robots" content="index, follow" />
    </Head>

    <main ref="mainRef" class="bg-[#080808] overflow-x-hidden">

      <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 200px;">
      </div>


      <nav ref="navRef" class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 opacity-0">
        <span class="text-white font-black text-sm tracking-[0.2em] uppercase">QR Studio</span>
        <span class="text-neutral-600 text-xs tracking-widest uppercase">Free · Open · Fast</span>
      </nav>

      <section class="relative h-screen flex flex-col justify-center px-8 md:px-16 overflow-hidden">

        <div ref="bgNumRef" class="absolute right-0 top-1/2 -translate-y-1/2 text-[40vw] font-black text-neutral-900 leading-none select-none pointer-events-none opacity-0">
          QR
        </div>

        <div class="max-w-7xl mx-auto w-full relative z-10">
          <p ref="taglineRef" class="text-green-400 text-xs font-bold tracking-[0.4em] uppercase mb-8 opacity-0">
            The QR Code Generator
          </p>

          <div class="mb-2">
            <h1 ref="line1Ref" class="text-[clamp(4rem,13vw,13rem)] font-black leading-[0.85] text-white tracking-tighter" style="transform: translateY(120%); opacity: 0;">
              Generate
            </h1>
          </div>
          <div class="mb-2">
            <h1 ref="line2Ref" class="text-[clamp(4rem,13vw,13rem)] font-black leading-[0.85] tracking-tighter text-green-400" style="transform: translateY(120%); opacity: 0;">
              Anything
            </h1>
          </div>
          <div class="mb-12">
            <h1 ref="line3Ref" class="text-[clamp(4rem,13vw,13rem)] font-black leading-[0.85] text-white tracking-tighter" style="transform: translateY(120%); opacity: 0;">
              Instantly.
            </h1>
          </div>

          <div ref="subtitleRef" class="flex flex-col md:flex-row md:items-end justify-between gap-8" style="opacity: 0; transform: translateY(30px);">
            <p class="text-neutral-500 text-lg max-w-xs leading-relaxed">
              Text, links, images, videos encoded into a fixed-size QR. Clean. Fast. Free.
            </p>
            <div class="flex gap-4">
              <button
                @click="scrollToGenerator"
                class="group flex items-center gap-4 text-white font-bold text-sm tracking-widest uppercase"
              >
                <span>Generate</span>
                <span class="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-green-400 group-hover:border-green-400 group-hover:text-black transition-all duration-300">→</span>
              </button>
              <NuxtLink
                to="/decode"
                class="group flex items-center gap-4 text-neutral-500 font-bold text-sm tracking-widest uppercase hover:text-white transition-colors"
              >
                <span>Decode</span>
                <span class="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center group-hover:bg-neutral-800 transition-all duration-300">↓</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div ref="scrollLineRef" class="absolute bottom-10 left-8 md:left-16 flex items-center gap-4" style="opacity: 0;">
          <div class="w-12 h-px bg-neutral-700"></div>
          <span class="text-neutral-700 text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      <div class="border-y border-neutral-900 py-5 overflow-hidden">
        <div ref="marqueeRef" class="flex gap-16 whitespace-nowrap" style="width: max-content;">
          <span v-for="i in 12" :key="i" class="text-neutral-800 text-sm font-bold tracking-widest uppercase">
            QR Studio &nbsp;·&nbsp; Text &nbsp;·&nbsp; Links &nbsp;·&nbsp; Images &nbsp;·&nbsp; Videos &nbsp;·&nbsp;
          </span>
        </div>
      </div>

      <section id="generator" class="min-h-screen flex items-center px-8 md:px-16 py-32">
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          <div>
            <p class="reveal-text text-neutral-600 text-xs tracking-[0.4em] uppercase mb-6">01 / Configure</p>
            <div class="mb-10">
              <h2 class="reveal-text text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                What are<br />you encoding?
              </h2>
            </div>

            <!-- Type tabs -->
            <div class="flex gap-2 mb-8 flex-wrap">
              <button
                v-for="t in types"
                :key="t.value"
                @click="selectedType = t.value"
                :class="[
                  'px-6 py-3 text-sm font-black tracking-widest uppercase transition-all duration-300 cursor-pointer border-b-2',
                  selectedType === t.value
                    ? 'text-green-400 border-green-400'
                    : 'text-neutral-600 border-transparent hover:text-neutral-300 hover:border-neutral-600'
                ]"
              >
                {{ t.label }}
              </button>
            </div>

            <div class="space-y-5">
              <div>
                <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">Label (optional)</label>
                <input
                  v-model="label"
                  placeholder="e.g. My Portfolio"
                  class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 focus:bg-neutral-800 transition-all text-sm"
                />
              </div>
              <div>
                <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">{{ contentLabel }}</label>
                <textarea
                  v-model="content"
                  :placeholder="placeholder"
                  rows="5"
                  class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 focus:bg-neutral-800 transition-all text-sm resize-none"
                />
              </div>
              <button
                @click="generate"
                :disabled="loading || !content.trim()"
                class="w-full py-5 rounded-xl font-black text-black bg-green-400 hover:bg-green-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 text-sm tracking-widest uppercase cursor-pointer"
              >
                {{ loading ? 'Generating...' : 'Generate QR Code' }}
              </button>

              <!-- Decode CTA -->
              <NuxtLink
                to="/decode"
                class="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-neutral-800 text-neutral-600 hover:border-green-400 hover:text-green-400 transition-all duration-300 text-sm font-bold tracking-widest uppercase cursor-pointer group"
              >
                <span>Decode a QR Code Instead</span>
                <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </NuxtLink>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center min-h-[480px]">
            <Transition name="scale">
              <div v-if="qrResult" class="text-center w-full">
                <p class="text-neutral-700 text-xs tracking-[0.4em] uppercase mb-2">02 / Result</p>
                <p class="text-white font-black text-3xl tracking-tight mb-10">{{ qrResult.label || 'Untitled' }}</p>

                <div class="relative inline-block">
                  <div class="absolute -inset-8 bg-green-400 opacity-[0.07] blur-3xl rounded-full"></div>
                  <div class="relative bg-white p-6 rounded-3xl shadow-2xl">
                    <img
                      :src="qrResult.qrDataUrl"
                      :alt="`QR code for ${qrResult.label || qrResult.content}`"
                      width="256"
                      height="256"
                      class="w-64 h-64 block"
                    />
                  </div>
                </div>

                <div class="flex gap-4 mt-10 justify-center">
                  <button @click="download" class="px-8 py-3 rounded-full bg-green-400 text-black text-sm font-black tracking-wide hover:bg-green-300 transition-all duration-300">
                    Download PNG
                  </button>
                  <button @click="reset" class="px-8 py-3 rounded-full border border-neutral-800 text-neutral-500 text-sm font-bold tracking-wide hover:border-neutral-600 hover:text-neutral-300 transition-all duration-300">
                    Reset
                  </button>
                </div>
              </div>

              <div v-else class="flex flex-col items-center gap-6">
                <div class="w-64 h-64 rounded-3xl border border-dashed border-neutral-800 flex items-center justify-center">
                  <p class="text-neutral-800 text-xs tracking-widest uppercase text-center px-4">Your QR<br />appears here</p>
                </div>
                <p class="text-neutral-800 text-xs tracking-widest uppercase">Ready when you are</p>
              </div>
            </Transition>
          </div>

        </div>
      </section>

      <section class="px-8 md:px-16 py-32 border-t border-neutral-900">
        <div class="max-w-7xl mx-auto">
          <div class="overflow-hidden mb-16">
            <h2 class="reveal-text text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Why QR Studio?
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-900">
            <div v-for="(f, i) in features" :key="i" class="bg-[#080808] p-10 group hover:bg-neutral-900 transition-colors duration-500">
              <span class="text-green-400 text-xs font-bold tracking-[0.3em] uppercase">0{{ i + 1 }}</span>
              <h3 class="text-white font-black text-2xl tracking-tight mt-6 mb-4 group-hover:text-green-400 transition-colors duration-300">{{ f.title }}</h3>
              <p class="text-neutral-700 text-sm leading-relaxed">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="px-8 md:px-16 py-32 border-t border-neutral-900">
        <div class="max-w-7xl mx-auto text-center">
          <div class="overflow-hidden mb-8">
            <h2 class="reveal-text text-6xl md:text-9xl font-black tracking-tighter leading-none text-white">
              Make Your QR
            </h2>
          </div>
          <button @click="scrollToGenerator" class="mt-8 px-12 py-5 rounded-full bg-green-400 text-black font-black text-sm tracking-widest uppercase hover:bg-green-300 transition-all duration-300">
            Generate Now →
          </button>
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
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

useSeoMeta({
  title: 'QR Studio Free QR Code Generator',
  description: 'Generate QR codes for text, links, images, and videos. Fixed size, clean design, free forever.',
  ogTitle: 'QR Studio Free QR Code Generator',
  ogDescription: 'Generate QR codes for text, links, images, and videos instantly.',
  twitterCard: 'summary_large_image'
})

const config = useRuntimeConfig()
const API = config.public.apiBase

const navRef = ref<HTMLElement | null>(null)
const taglineRef = ref<HTMLElement | null>(null)
const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)
const line3Ref = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const scrollLineRef = ref<HTMLElement | null>(null)
const bgNumRef = ref<HTMLElement | null>(null)
const marqueeRef = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)
const cursorFollowerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  window.addEventListener('mousemove', (e) => {
    gsap.to(cursorRef.value, { x: e.clientX, y: e.clientY, duration: 0.1 })
    gsap.to(cursorFollowerRef.value, { x: e.clientX, y: e.clientY, duration: 0.4 })
  })

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.to(navRef.value, { opacity: 1, duration: 1 })
    .to(taglineRef.value, { opacity: 1, duration: 0.8 }, '-=0.5')
    .to(bgNumRef.value, { opacity: 1, duration: 1.5 }, '-=0.8')
    .to(line1Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=1')
    .to(line2Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
    .to(line3Ref.value, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
    .to(subtitleRef.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to(scrollLineRef.value, { opacity: 1, duration: 0.8 }, '-=0.3')

  gsap.to(marqueeRef.value, {
    x: '-50%',
    duration: 20,
    ease: 'none',
    repeat: -1
  })

  gsap.utils.toArray('.reveal-text').forEach((el: any) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      }
    )
  })
})

const types = [
  { label: 'Text', value: 'text' },
  { label: 'Link', value: 'link' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' }
]

const features = [
  { title: 'Fixed Size QR', desc: 'Every QR code is the same compact size whether it\'s 5 characters or 500.' },
  { title: 'Any Content', desc: 'Text, URLs, image links, video links all supported with one clean interface.' },
  { title: 'Instant Download', desc: 'Download your QR code as a high-quality PNG, ready to print or share.' }
]

const selectedType = ref('text')
const content = ref('')
const label = ref('')
const loading = ref(false)
const qrResult = ref<any>(null)

const contentLabel = computed(() => {
  const map: Record<string, string> = { text: 'Your Text', link: 'URL', image: 'Image URL', video: 'Video URL' }
  return map[selectedType.value]
})

const placeholder = computed(() => {
  const map: Record<string, string> = {
    text: 'Enter your text here...',
    link: 'https://example.com',
    image: 'https://example.com/image.jpg',
    video: 'https://youtube.com/watch?v=...'
  }
  return map[selectedType.value]
})

async function generate() {
  if (!content.value.trim()) return
  loading.value = true
  try {
    const res = await $fetch(`${API}/api/qr/generate`, {
      method: 'POST',
      body: { type: selectedType.value, content: content.value, label: label.value }
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

function reset() {
  qrResult.value = null
  content.value = ''
  label.value = ''
}

function scrollToGenerator() {
  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
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