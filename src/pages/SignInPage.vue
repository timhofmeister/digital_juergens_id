<template>
<q-layout>
<q-page-container>
    <q-page class="flex flex-center">
        <div class="q-gutter-md q-px-lg" style="width: 100%">
            <div class="text-h6">Digitale Jürgens ID</div>
            <q-banner v-if="showError" inline-actions class="text-white bg-red">{{ showError }}</q-banner>
            <q-input v-model="email" filled type="email" hint="Email" />

            <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" hint="Password">
            <template v-slot:append>
                <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                />
            </template>
            </q-input>

            <q-btn :loading="buttonLoading" color="primary" @click="handleSignIn" label="Anmelden" />
        </div>
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
