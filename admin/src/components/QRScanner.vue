<template>
    <div class="scanner">
        <qrcode-stream @decode="onDecode"></qrcode-stream>
    </div>
</template>

<script>
import { QrcodeStream } from 'vue3-qrcode-reader'

export default {
    name: 'ClientScanQr',
    components:{
        QrcodeStream,
    },
    methods: {
        onDecode (decodedString) {
            const data = decodedString
            this.$emit('qr-data', JSON.parse(data))
        }
    },
    emits: ['qr-data']
}
</script>

<style scoped>
    .scanner{
        width: 30%;
        height: 50%;
        margin: 0 auto;
    }

     @media (max-width: 500px) {
         .scanner{
              width: 90%;
         }
        
    }
     @media (max-width: 900px) {
         .scanner{
              width: 90%;
         }
    }
</style>
    
