<template>
  <q-layout view="hHh lpR fFf">

    <!-- Header -->
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title>
            <q-img
            src="icons/st_juegrens_am_strande.png"
            spinner-color="white"
            style="max-width: 200px"
            />
        </q-toolbar-title>

        <q-btn flat round dense icon="more_vert">
            <q-menu anchor="bottom left" self="top left" transition-show="jump-down" transition-hide="jump-up">
            <q-item clickable ripple v-close-popup @click="showAvatarUpload=true">
                <q-item-section>Profilbild ändern</q-item-section>
            </q-item>
            <q-item clickable ripple v-close-popup @click="showPwdChange=true">
                <q-item-section>Passwort ändern</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable ripple v-close-popup @click="showLogoutConfirmation = true">
                <q-item-section>Abmelden</q-item-section>
            </q-item>
            </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <ChangePwdComponent v-model="showPwdChange" />
    <UploadAvatarComponent v-model="showAvatarUpload" />

    <!-- Dialog for logout confirmation -->
    <q-dialog v-model="showLogoutConfirmation" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{ profile.name }},<br/> möchtest du dich wirklich abmelden obwohl du den Rang "{{ profile.rank }}" hast?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Cancel" color="primary" ripple v-close-popup />
          <q-btn flat label="Abmelden" color="primary" ripple v-close-popup @click="logout"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Main page view -->
    <q-page-container class="bg-grey-4">
      <router-view />
    </q-page-container>

    <!-- Navigation footer -->
    <q-footer elevated class="bg-white">
        <q-tabs active-color="blue-10" class="text-grey-8">
            <q-route-tab icon="public" :to="{name: 'map'}"/>
            <q-route-tab icon="person" :to="{name: 'user'}"/>
            <q-route-tab icon="qr_code_scanner" :to="{name: 'verify'}"/>
        </q-tabs>
        
      </q-footer>
  </q-layout>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { ref, onBeforeUnmount } from 'vue'

    import 'vue-advanced-cropper/dist/style.css';
    import ChangePwdComponent from 'src/components/ChangePwdComponent.vue'
    import UploadAvatarComponent from 'src/components/UploadAvatarComponent.vue'
    
    import { useProfileStore } from 'src/stores/profileStore'
    import { useLocationStore } from 'src/stores/locationStore'
    
    const profile = useProfileStore();
    const location = useLocationStore();
    const router = useRouter();

    const showPwdChange = ref(false);
    const showAvatarUpload = ref(false);
    const showLogoutConfirmation = ref(false)

    location.startTracking();

    onBeforeUnmount(() => {
        location.stopTracking()
        console.log("Main Layout before unmount")
    })
    
    const logout = () => {
        confirm.value = false;
        profile.logout();
        router.push({name: 'sign-in'})
    }

</script>
