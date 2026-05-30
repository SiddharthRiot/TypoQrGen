<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close"></div>

      <div class="relative w-full max-w-md mx-4 rounded-3xl border border-neutral-800 bg-[#0f0f0f] p-10 z-10">

        <button @click="close" class="absolute top-6 right-6 w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600 hover:border-neutral-600 hover:text-white transition-all duration-300 text-sm">
          ✕
        </button>

        <div class="mb-8">
          <p class="text-green-400 text-xs font-bold tracking-[0.4em] uppercase mb-3">QR Studio</p>
          <h2 class="text-4xl font-black text-white tracking-tighter leading-none" style="white-space: pre-line;">
            {{ mode === 'signin' ? 'Welcome\nback.' : otpSent ? 'Check your\nemail.' : 'Get\nstarted.' }}
          </h2>
        </div>

        <!-- Toggle — only before OTP sent -->
        <div v-if="!otpSent" class="flex gap-1 mb-8 bg-neutral-900 rounded-xl p-1">
          <button @click="mode = 'signin'; resetForm()" :class="['flex-1 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-300', mode === 'signin' ? 'bg-white text-black' : 'text-neutral-600 hover:text-neutral-400']">Sign In</button>
          <button @click="mode = 'signup'; resetForm()" :class="['flex-1 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-300', mode === 'signup' ? 'bg-white text-black' : 'text-neutral-600 hover:text-neutral-400']">Sign Up</button>
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-6 px-4 py-3 rounded-xl bg-red-900/20 border border-red-900/50 text-red-400 text-sm">{{ error }}</div>

        <!-- Success -->
        <div v-if="successMsg" class="mb-6 px-4 py-3 rounded-xl bg-green-900/20 border border-green-900/50 text-green-400 text-sm">{{ successMsg }}</div>

        <!-- SIGNUP FLOW -->
        <div v-if="mode === 'signup'" class="space-y-4">

          <!-- Step 1: Details + Send OTP -->
          <template v-if="!otpSent">
            <div>
              <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">Name</label>
              <input v-model="name" placeholder="Your name" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 transition-all text-sm" />
            </div>
            <div>
              <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">Email</label>
              <input v-model="email" type="email" placeholder="you@example.com" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 transition-all text-sm" />
            </div>
            <div>
              <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">Password</label>
              <input v-model="password" type="password" placeholder="••••••••" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 transition-all text-sm" />
            </div>
            <button @click="sendOtp" :disabled="loading" class="w-full py-4 rounded-xl font-black text-black bg-green-400 hover:bg-green-300 disabled:opacity-30 transition-all duration-300 text-sm tracking-widest uppercase">
              {{ loading ? 'Sending OTP...' : 'Send OTP' }}
            </button>
          </template>

          <!-- Step 2: OTP -->
          <template v-else>
            <p class="text-neutral-500 text-sm">OTP sent to <span class="text-white font-bold">{{ email }}</span></p>
            <div>
              <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">OTP Code</label>
              <input v-model="otp" placeholder="6-digit code" maxlength="6" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 transition-all text-sm tracking-widest text-center text-xl font-bold" />
            </div>
            <button @click="submit" :disabled="loading" class="w-full py-4 rounded-xl font-black text-black bg-green-400 hover:bg-green-300 disabled:opacity-30 transition-all duration-300 text-sm tracking-widest uppercase">
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>
            <button @click="otpSent = false; successMsg = ''" class="w-full py-3 text-neutral-600 text-sm hover:text-neutral-400 transition-colors">
              ← Change details
            </button>
          </template>

        </div>

        <!-- SIGNIN FLOW -->
        <div v-else class="space-y-4">
          <div>
            <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">Email</label>
            <input v-model="email" type="email" placeholder="you@example.com" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 transition-all text-sm" />
          </div>
          <div>
            <label class="text-xs font-bold tracking-[0.3em] text-neutral-700 uppercase block mb-2">Password</label>
            <input v-model="password" type="password" placeholder="••••••••" class="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-700 focus:outline-none focus:border-green-400 transition-all text-sm" />
          </div>
          <button @click="submit" :disabled="loading" class="w-full py-4 rounded-xl font-black text-black bg-green-400 hover:bg-green-300 disabled:opacity-30 transition-all duration-300 text-sm tracking-widest uppercase">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ isOpen: boolean, initialMode?: 'signin' | 'signup' }>()
const emit = defineEmits(['close', 'success'])

const config = useRuntimeConfig()
const API = config.public.apiBase

const mode = ref<'signin' | 'signup'>(props.initialMode || 'signin')
const name = ref('')
const email = ref('')
const password = ref('')
const otp = ref('')
const otpSent = ref(false)
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

watch(() => props.initialMode, (val) => { if (val) mode.value = val })
watch(() => props.isOpen, (val) => { if (!val) resetAll() })

function close() { emit('close') }

function resetForm() {
  error.value = ''
  successMsg.value = ''
  otpSent.value = false
  otp.value = ''
}

function resetAll() {
  name.value = ''
  email.value = ''
  password.value = ''
  otp.value = ''
  otpSent.value = false
  error.value = ''
  successMsg.value = ''
}

async function sendOtp() {
  error.value = ''
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill all fields'
    return
  }
  loading.value = true
  try {
    await $fetch(`${API}/api/auth/send-otp`, {
      method: 'POST',
      body: { email: email.value }
    })
    otpSent.value = true
    successMsg.value = 'OTP sent! Check your inbox.'
  } catch (e: any) {
    error.value = e?.data?.error || 'Failed to send OTP'
  } finally {
    loading.value = false
  }
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const endpoint = mode.value === 'signin' ? '/api/auth/signin' : '/api/auth/signup'
    const body: any = { email: email.value, password: password.value }
    if (mode.value === 'signup') { body.name = name.value; body.otp = otp.value }

    const res: any = await $fetch(`${API}${endpoint}`, { method: 'POST', body })

    localStorage.setItem('qr_token', res.token)
    localStorage.setItem('qr_user', JSON.stringify(res.user))

    emit('success', res.user)
    close()
  } catch (e: any) {
    error.value = e?.data?.error || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>