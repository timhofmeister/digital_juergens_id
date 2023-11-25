<template>

    <q-page class="flex flex-center">
        
        <qrcode-stream v-if="gotPermission" @detect="onDetect"></qrcode-stream>
        
        <div class="text-h6">{{ permissionStatus }}</div>
        <!--
            <video ref="videoElement"></video>
            <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
        -->

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
    import { ref, onMounted} from 'vue'
    import useSupabase from 'boot/supabase'
    import CryptoJS from 'crypto-js'
    import { useProfileStore } from 'src/stores/profileStore'
    import { useQuasar } from 'quasar'
    
    // import { StreamBarcodeReader } from "vue-barcode-reader";
    import { QrcodeStream } from 'vue3-qrcode-reader'

    // function onDecode (result) { console.log(result) }

    // cordova.plugins.mlkit.barcodeScanner.scan(
    //     options,
    //     (result) => {
    //         // Do something with the data
    //         alert(result);
    //     },
    //     (error) => {
    //         // Error handling
    //     },
    //     );
    
    const profile = useProfileStore();
    const { supabase } = useSupabase();
    const $q = useQuasar();

    const permissionStatus = ref('Init Variable permissionStatus');
    const gotPermission = ref(false);
    // const videoElement = ref(null);
    var permissions;
    onMounted(async () => {
        
        profile.fetchProfileOnce();

        if($q.platform.is.nativeMobile && $q.platform.is.android){
            permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions.CAMERA, (status) => {
                if (!status.hasPermission) {
                    console.log("No Camera permission");
                    permissionStatus.value = "No Camera permission, requesting Permission";
                    permissions.requestPermission(permissions.CAMERA, (status) => {
                        permissionStatus.value = "Request success";
                        gotPermission.value = true;
                    }, (status) => {
                        permissionStatus.value = "Request Error";
                    });
                }
                else {
                    permissionStatus.value = "Already got camera permission :)";
                    gotPermission.value = true;
                }
            });
        }
        else if($q.platform.is.nativeMobile && $q.platform.is.ios){
            permissionStatus.value = "Platfor ios";
            gotPermission.value = true;
        }
        else { 
            gotPermission.value = true;
        }


        // const stream = await navigator.mediaDevices.getUserMedia({
        //     video: {facingMode: 'environment'}
        // });
        // videoElement.value.srcObject = stream;
        // videoElement.value.setAttribute('playsinline', true);
        // videoElement.value.play();
    })

    // navigator.camera.getPicture(
    //     data => { // on success
    //       // imageSrc.value = `data:image/jpeg;base64,${data}`
    //       console.log(data)
    //     },
    //     () => { // on fail
    //       $q.notify('Could not access device camera.')
    //     },
    //     {
    //       // camera options
    //     }
    //   )
    

    // onMounted(() => {
    //     profile.fetchProfileOnce()
    // })

    const showVerifyDialog = ref(false);
    const verifyState = ref(0); // 0: loading, 1: success, 2: error

    const this_owner_name = ref('...');

    const onDetect = (firstDetectedCode) => {
        firstDetectedCode.then(async (result) => {
            permissionStatus.value = 'called onDetect'
            const [magic, owner_id, owner_name] = CryptoJS.AES.decrypt(result.content, 'hallo asdasd sdf').toString(CryptoJS.enc.Utf8).split("&#&");
            console.log(profile)
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
