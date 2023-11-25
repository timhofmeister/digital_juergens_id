<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title>
            <q-img
            src="icons/st_juegrens_am_strande.png"
            spinner-color="white"
            style="max-width: 180px"
            />
        </q-toolbar-title>

        <q-btn flat round dense icon="more_vert">

            <q-menu anchor="bottom left" self="top left" transition-show="jump-down" transition-hide="jump-up">
            <q-item clickable v-close-popup>
                <q-item-section>Profilbild ändern</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
                <q-item-section>Password ändern</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="logout">
                <q-item-section>Abmelden</q-item-section>
            </q-item>
            </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-white">
        <q-tabs active-color="black" class="text-grey-8">
          <q-route-tab icon="person" :to="{name: 'user'}"/>
          <q-route-tab icon="qr_code_scanner" :to="{name: 'verify'}"/>
        </q-tabs>
        
      </q-footer>
  </q-layout>
</template>

<script setup>
    import { useProfileStore } from 'src/stores/profileStore'
    import { useRouter } from 'vue-router';
    const profile = useProfileStore();
    const router = useRouter();

    const logout = () => {
        profile.logout();
        router.push({name: 'sign-in'})
    }

</script>
