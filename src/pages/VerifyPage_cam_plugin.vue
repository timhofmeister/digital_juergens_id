<template>

    <q-page class="flex flex-center">
        <div class="text-h6">Try Camera Plugin</div>
        <video ref="videoElement"></video>
        <!--
        -->
        <div class="text-h6">{{ permissionStatus }}</div>

    </q-page>

</template>

<script setup>
    import { ref, onMounted} from 'vue'
    import useSupabase from 'boot/supabase'
    import CryptoJS from 'crypto-js'
    import { useProfileStore } from 'src/stores/profileStore'
    import { useQuasar } from 'quasar'

    
    const profile = useProfileStore();
    const { supabase } = useSupabase();
    const $q = useQuasar();

    const permissionStatus = ref('Init Variable permissionStatus');
    const gotPermission = ref(false);
    const videoElement = ref(null);
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

        console.log("Start awaiting stream")
        videoElement.value.setAttribute('autoplay', '');
        videoElement.value.setAttribute('muted', '');
        videoElement.value.setAttribute('playsinline', '');
        // videoElement.value.setAttribute('playsinline', true);
        videoElement.value.play();

        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false, video: true,
                video: {facingMode: 'environment'}
            });
        } catch(err){
            console.log("Error in getUserMedia")
            console.log(err)
        }
        console.log("Stream " + stream);
        videoElement.value.srcObject = stream;

        // navigator.camera.getPicture(
        //     data => { // on success
        //       // imageSrc.value = `data:image/jpeg;base64,${data}`
        //       console.log(data)
        //     },
        //     () => { // on fail
        //       console.log('Could not access device camera.')
        //     },
        //     {
        //       // camera options
        //     }
        //   )
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

</script>
