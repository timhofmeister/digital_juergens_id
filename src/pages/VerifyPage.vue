<template>

    <q-page class="flex flex-center">
        
        <qrcode-stream @detect="onDetect"></qrcode-stream>

        <q-dialog v-model="showVerifyDialog">
            <q-card >
                <q-card-section>
                    <div class="text-h6">Kontrolliere {{ this_owner_name }}</div>
                </q-card-section>
                <q-card-section class="text-center">    
                    <q-inner-loading :showing="verifyState == 0" />
                    <q-avatar v-if="verifyState == 1" color="green-8" text-color="white" icon="check" />
                    <q-avatar v-if="verifyState == 2" color="red-8" text-color="white" icon="error" />
                </q-card-section>
                <q-card-section>
                    <div class="text-caption text-grey">{{ this_owner_name }} verifiziert von {{ profile.name }}</div>
                </q-card-section>
            </q-card>
        </q-dialog>

    </q-page>

</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import useSupabase from 'boot/supabase'
    import CryptoJS from 'crypto-js'
    import { useProfileStore } from 'src/stores/profileStore'
    import { QrcodeStream } from 'vue3-qrcode-reader'

    const profile = useProfileStore();
    const { supabase } = useSupabase();

    onMounted(() => {
        profile.fetchProfileOnce()
    })

    const showVerifyDialog = ref(false);
    const verifyState = ref(0); // 0: loading, 1: success, 2: error

    const this_owner_name = ref('...');

    const onDetect = (firstDetectedCode) => {
        firstDetectedCode.then(async (result) => {
            const [magic, owner_id, owner_name] = CryptoJS.AES.decrypt(result.content, 'hallo asdasd sdf').toString(CryptoJS.enc.Utf8).split("&#&");
            if(!magic || magic !== profile.MAGIC) return;

            showVerifyDialog.value = true;
            this_owner_name.value = owner_name;

            try{
                const { data, error } = await supabase
                .from('id_checks')
                .insert([
                    {
                        owner_id: owner_id, 
                        inspector_id: profile.id
                    },
                ])
            if (error) throw error
            setTimeout(() => verifyState.value = 1, 2000);

        } catch (error) {
            setTimeout(() => verifyState.value = 2, 2000);
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            setTimeout(() => {
                showVerifyDialog.value = false;
                verifyState.value = 0;
            }, 4000);
        }

        })
    }

</script>
