<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');

const submitName = () => {
    if (name.value.trim()) {
        localStorage.setItem('guestName', name.value);
        router.push('/thank-you');
    }
};
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-pink-50 text-gray-800">
        <div class="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 animate-fade-in-up">
            <h1 class="text-4xl font-serif text-center mb-2 text-indigo-900">Selamat Datang</h1>
            <p class="text-center text-gray-500 mb-8 font-light">Mohon isi data diri Anda untuk buku tamu</p>

            <form @submit.prevent="submitName" class="space-y-6">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input 
                        type="text" 
                        id="name" 
                        v-model="name"
                        class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 bg-white/70 placeholder-gray-400 outline-none"
                        placeholder="Contoh: Budi Santoso"
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Masuk
                </button>
            </form>
            
            <p class="mt-8 text-xs text-center text-gray-400">Terima kasih atas kehadiran Anda</p>
        </div>
    </div>
</template>

<style>
@keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
}
</style>
