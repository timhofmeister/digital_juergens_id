<template>

    <q-page class="flex flex-center">
        
        <qrcode-stream v-if="gotPermission" @detect="onDetect"></qrcode-stream>
        
        <!--<div class="text-h6">{{ permissionStatus }}</div>-->

        <q-dialog v-model="showVerifyDialog">
            <q-card >
                <q-card-section>
                    <div class="text-h6">Kontrolliere {{ this_owner_name }}</div>
                </q-card-section>
                <q-card-section class="text-center">    
                    <q-inner-loading :showing="verifyState == 0" />
                    <q-avatar v-if="verifyState == 1" color="positive" text-color="white" icon="check" />
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
    import { useLocationStore } from 'src/stores/locationStore'
    import { useQuasar } from 'quasar'
    import { QrcodeStream } from 'vue3-qrcode-reader'
    
    const profile = useProfileStore();
    const location = useLocationStore();

    const { supabase } = useSupabase();
    const $q = useQuasar();

    const permissionStatus = ref('Init Variable permissionStatus');
    const gotPermission = ref(false);
    // var permissions;

    
    
    onMounted(async () => {
        
        profile.fetchProfileOnce();

        if($q.platform.is.nativeMobile && $q.platform.is.android){
            const permissions = cordova.plugins.permissions;
            permissions.checkPermission(permissions.CAMERA, (status) => {
                if (!status.hasPermission) {
                    permissionStatus.value = "No Camera permission, requesting Permission";
                    permissions.requestPermission(permissions.CAMERA, (status) => {
                        permissionStatus.value = "Request success";
                        gotPermission.value = true;
                    }, (status) => {
                        permissionStatus.value = "Request Error";
                        gotPermission.value = false;
                    });
                }
                else {
                    permissionStatus.value = "Already got camera permission :)";
                    gotPermission.value = true;
                }
            });
        }
        else if($q.platform.is.nativeMobile && $q.platform.is.ios){
            permissionStatus.value = "Platform ios";
            gotPermission.value = true;
        }
        else { 
            permissionStatus.value = "Platform Web";
            gotPermission.value = true;
        }
    });
    
    // document.addEventListener("deviceready", checkPermissions, false);


    const showVerifyDialog = ref(false);
    const verifyState = ref(0); // 0: loading, 1: success, 2: error

    const this_owner_name = ref('...');
    
    const onDetect = (firstDetectedCode) => {
        firstDetectedCode.then(async (result) => {
            permissionStatus.value = 'called onDetect'
            const [magic, owner_id, owner_name] = CryptoJS.AES.decrypt(result.content, profile.qrKey).toString(CryptoJS.enc.Utf8).split("&#&");
            if(!magic || magic !== profile.MAGIC) return;

            showVerifyDialog.value = true;
            this_owner_name.value = owner_name;
            
            let currentLocation = null;
            if(location.latitude && location.longitude) {
                currentLocation = `POINT(${location.longitude} ${location.latitude})`
            }
            // currentLocation = `POINT(6.964705272617972 50.948057634242645)` 

            try{
                const { data, error } = await supabase
                .from('id_checks')
                .insert([
                    {
                        owner_id: owner_id, 
                        inspector_id: profile.id,
                        location: currentLocation
                    },
                ])
            if (error) throw error
            setTimeout(() => verifyState.value = 1, 2000);

        } catch (error) {
            setTimeout(() => verifyState.value = 2, 2000);
            if (error instanceof Error) {
                console.log(error.message)
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
