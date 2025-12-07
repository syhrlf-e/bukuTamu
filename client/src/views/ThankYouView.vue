<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import QRCode from 'qrcode';
import { useRouter } from 'vue-router';

const guestName = ref('');
const merchandise = ref('');
const qrCodeUrl = ref('');
const showModal = ref(false);
const pollingInterval = ref(null);
const uniqueId = Math.random().toString(36).substring(2, 15);

const merchandiseList = [
    'Sendok Cantik',
    'Piring Kecil',
    'Gantungan Kunci',
    'Kipas Tangan',
    'Tumbler Mini',
    'Pouch Serbaguna',
    'Cokelat Batang',
    'Notes Kecil'
];

const generateRandomMerchandise = () => {
    const randomIndex = Math.floor(Math.random() * merchandiseList.length);
    return merchandiseList[randomIndex];
};

const checkScanStatus = async () => {
    try {
        const response = await fetch(`/api/check-scan/${uniqueId}`);
        const data = await response.json();
        if (data.scanned) {
            showModal.value = true;
            if (pollingInterval.value) clearInterval(pollingInterval.value);
        }
    } catch (error) {
        console.error('Polling error:', error);
    }
};

onMounted(async () => {
    guestName.value = localStorage.getItem('guestName') || 'Tamu Undangan';
    merchandise.value = generateRandomMerchandise();
    
    // QR Code now points to the server endpoint
    const scanUrl = `${window.location.origin}/api/scan/${uniqueId}`;
    
    try {
        qrCodeUrl.value = await QRCode.toDataURL(scanUrl, {
            color: {
                dark: '#000000', // Black
                light: '#ffffff' // White
            },
            width: 200,
            margin: 2
        });
        
        // Start polling
        pollingInterval.value = setInterval(checkScanStatus, 2000);
        
    } catch (err) {
        console.error(err);
    }
});

onUnmounted(() => {
    if (pollingInterval.value) clearInterval(pollingInterval.value);
});
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-pink-50 text-gray-800">
        <div class="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 animate-fade-in-up text-center">
            
            <div class="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 class="text-3xl font-serif text-indigo-900 mb-2">Terima Kasih!</h1>
            <p class="text-gray-600 mb-8 font-light text-lg">Hadirin yang terhormat, <span class="font-semibold text-indigo-700">{{ guestName }}</span></p>

            <div class="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100 flex flex-col items-center">
                <p class="text-sm text-gray-500 mb-4">Scan QR Code ini untuk melihat souvenir Anda:</p>
                <div class="flex justify-center mb-4 min-h-[200px] items-center bg-white p-2 rounded-lg shadow-sm">
                    <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Merchandise QR Code" class="rounded-lg" />
                    <div v-else class="text-gray-300 animate-pulse">Generating QR...</div>
                </div>
                
                <div class="mt-4 text-center">
                   <p class="text-xs text-gray-400 italic">Silakan scan QR Code di atas menggunakan kamera HP Anda</p>
                </div>
            </div>
            
            <router-link to="/" class="text-sm text-indigo-500 hover:text-indigo-700 font-medium">
                Kembali ke Halaman Depan
            </router-link>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showModal = false"></div>
            <div class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in border border-indigo-100">
                <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                </div>
                <h3 class="text-2xl font-serif text-indigo-900 mb-2">Selamat!</h3>
                <p class="text-gray-600 mb-6">Anda mendapatkan:</p>
                <div class="text-xl font-bold text-indigo-600 bg-indigo-50 py-3 px-4 rounded-xl border border-indigo-100 mb-6">
                    {{ merchandise }}
                </div>
                <button 
                    @click="showModal = false" 
                    class="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
}

@keyframes bounce-in {
    0% { opacity: 0; transform: scale(0.8); }
    50% { transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
}
.animate-bounce-in {
    animation: bounce-in 0.5s ease-out forwards;
}
</style>
