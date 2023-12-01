<template>
  <q-page class="flex flex-center">

    <q-pull-to-refresh @refresh="refresh" color="blue-8">

        <div class="q-pa-md row items-start q-gutter-md">    
            
            <q-card :class="profile.isCheckedState == 2 ? 'my-card-verified' : 'my-card'">
                <q-banner v-if="profile.error" inline-actions class="text-white bg-red-5">Something went wrong...</q-banner>

                <q-card-section horizontal class="justify-between">
                    <q-card-section class="q-py-xs">
                    <div class="text-overline">Digitale Jürgens ID</div>
                    <div class="text-h5 q-my-xs">{{ profile.name }}</div>
                    <div class="text-caption text-grey-8">Mitgliedsnummer:</div>
                    <div class="text-subtitle1">{{ profile.membership_num }}</div>
                    </q-card-section>
                    
                    <q-card-section>
                        <q-avatar size="6rem">
                            <img v-if="profile.avatar_src" :src="profile.avatar_src">
                        </q-avatar>
                        <q-inner-loading :showing="profile.loadingAvatar" color="primary" />
                    </q-card-section>
                </q-card-section>

                <q-card-section class="q-py-xs">
                    <div class="text-caption text-grey">
                        Nachweis über die Mitgliedschaft im Verein <b>"St. Jürgens am Strande"</b>. Gegründet am 10.10.2015 um 22:22 Uhr in Wolfenbüttel.
                    </div>
                </q-card-section>

                <q-card-section horizontal class="justify-between items-end">
                    <q-card-section class="q-pt-sm">
                    <div class="text-caption text-grey-8">Geburtsdatum:</div>
                    <div class="text-subtitle1 q-mb-xs">{{ date.formatDate(profile.birthday, 'DD.MM.YYYY') }}</div>

                    <div class="text-caption text-grey-8">Ausstellungsdatum:</div>
                    <div class="text-subtitle1 q-mb-xs">{{ date.formatDate(profile.date_of_issue, 'DD.MM.YYYY') }}</div>

                    <div class="text-caption text-grey-8">Aktueller Rang:</div>
                    <div class="text-subtitle1">{{ profile.rank }}</div>
                    <div class="text-caption text-grey-10">Geschäftsjahr {{ profile.fiscal_year }}</div>
                    </q-card-section>
                    <q-card-section class="q-mr-sm">
                        <q-circular-progress v-if="profile.isCheckedState == 1" indeterminate size="1.5rem" color="positive" />
                        <q-icon v-if="profile.isCheckedState == 2" name="task_alt" size="2rem" color="positive"/>
                    </q-card-section>
                </q-card-section>

                <q-separator inset :color="profile.isCheckedState == 2 ? 'positive' : 'grey-5'"/>

                <q-card-section class="flex flex-center">
                    <qrcode-vue :value="profile.qrData" :size="250"/>
                </q-card-section>

            </q-card>
        </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup>
    import { onMounted } from 'vue'
    import QrcodeVue from 'qrcode.vue'
    import { useProfileStore } from 'src/stores/profileStore'
    import { date } from 'quasar'

    const profile = useProfileStore();
    onMounted(() => {
        profile.fetchProfileOnce()
    })

    const refresh = (done) => {
        profile.fetchProfile();
        setTimeout(() => done(), 500); // Keep refresh icon alive for 500ms
    }

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  border-width: 0px
  border-radius: 10px
  border-color: $grey-5

.my-card-verified
  width: 100%
  border-style: solid
  border-width: 1.5px
  border-radius: 10px
  border-color: $positive
</style>
