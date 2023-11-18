<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-grey-3 text-primary">
        <q-tabs active-color="black" class="text-grey-8">
          <q-route-tab icon="person" :to="{name: 'user'}"/>
          <q-route-tab icon="qr_code_scanner" :to="{name: 'verify'}"/>
        </q-tabs>
        
      </q-footer>
  </q-layout>
</template>

<script setup>


</script>
