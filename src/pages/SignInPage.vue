<template>
<q-layout>
<q-page-container class="bg-grey-4">
    <q-page class="flex flex-center">
        <q-card class="signin-card q-ma-lg">
            <q-banner v-if="showError" inline-actions class="text-white bg-red">{{ showError }}</q-banner>
            <q-card-section class="text-h6">
                Digitale Jürgens ID
            </q-card-section>
            <q-separator inset />
            <q-card-section>
                <q-input v-model="email" filled type="email" hint="Email" />
            </q-card-section>
            <q-card-section>
                <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password">
                    <template v-slot:append>
                        <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                        />
                    </template>
                    </q-input>
                </q-card-section>
                <q-card-actions class="q-ma-sm">
                    <q-btn :loading="buttonLoading" color="primary" @click="handleSignIn" label="Anmelden" />
                </q-card-actions>
        </q-card>
    </q-page>
</q-page-container>
</q-layout>
</template>

<script setup>
import { ref } from 'vue'
import useSupabase from 'boot/supabase'
import { useRouter } from 'vue-router';

const password = ref('');
const isPwd = ref(true);
const email = ref('');
const showError = ref(false);

const buttonLoading = ref(false)

const router = useRouter()
const { supabase } = useSupabase();

const handleSignIn = async () => {
    buttonLoading.value = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        if (error) throw error
        router.push({name: 'user'})
    } catch (error) {
        if (error instanceof Error) {
            showError.value = error.message
        }
    } finally {
        buttonLoading.value = false;
    }
}

</script>

<style lang="sass" scoped>
.signin-card
  width: 100%
  max-width: 500px
  border-radius: 10px
</style>
