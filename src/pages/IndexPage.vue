<template>
  <q-page class="flex flex-center">

    <q-pull-to-refresh @refresh="refresh">

        <div class="q-pa-md row items-start q-gutter-md">    
            
            <q-card :class="profile.isChecked ? 'my-card-verified' : 'my-card'" flat bordered>
                <q-banner v-if="profile.error" inline-actions class="text-white bg-red-5">Something went wrong...</q-banner>

                <q-card-section horizontal class="justify-between">
                    <q-card-section class="q-py-xs">
                    <div class="text-overline">Digitale Jürgens ID</div>
                    <div class="text-h5 q-my-xs">{{ profile.name }}</div>
                    <div class="text-caption text-grey-8">Mitgliednummer:</div>
                    <div class="text-subtitle1">{{ profile.membership_num }}</div>
                    </q-card-section>
                    
                    <q-card-section>
                        <q-avatar size="6rem">
                            <img src="https://cdn.quasar.dev/img/avatar.png">
                        </q-avatar>
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
                    <div class="text-subtitle1 q-mb-xs">{{ profile.rank }}</div>
                    </q-card-section>
                    <q-card-section class="q-mr-sm">
                        <q-icon v-if="profile.isChecked" name="task_alt" size="2rem" color="green-8"/>
                    </q-card-section>
                </q-card-section>

                <q-separator inset :color="profile.isChecked ? 'green-8' : 'grey-5'"/>

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
        setTimeout(() => done(), 500);
    }

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  border-color: $grey-5

.my-card-verified
  width: 100%
  border-color: $green-8
</style>
