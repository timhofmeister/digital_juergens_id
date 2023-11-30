<template>
<q-dialog v-model="showPwdChange" class="flex flex-center">
    <q-card class="signin-card q-ma-lg">
        <q-banner v-if="showError" inline-actions class="text-white bg-red">{{ showError }}</q-banner>
        <q-banner v-if="showConfirmation" inline-actions class="text-white bg-positive">{{ showConfirmation }}</q-banner>

        <q-card-section>
            <q-input v-model="password1" filled type="password" @update:model-value="checkPwd" hint="Neues Passwort" />
        </q-card-section>
        <q-card-section>
            <q-input v-model="password2" filled :bg-color="match ? '' : 'red-2'" @update:model-value="checkPwd" type="password" hint="Passwort bestätigen" />
        </q-card-section>
            <q-card-actions class="q-ma-sm">
                <q-btn :loading="buttonLoading" color="primary" @click="handlePwdChange" ripple label="Passwort ändern" />
            </q-card-actions>
    </q-card>
</q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import useSupabase from 'boot/supabase'

const { supabase } = useSupabase();

const password1 = ref('');
const password2 = ref('');
const match = ref(true);

const showError = ref('');
const showConfirmation = ref('');
const buttonLoading = ref(false);

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const showPwdChange = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
watch(showPwdChange, (newValue, oldValue) => {
        if(oldValue){
            showError.value = '';
            showConfirmation.value = '';
        }
    })

const checkPwd = () => {
    showError.value = '';
    match.value = password1.value === password2.value;
}

const handlePwdChange = async () => {    
    buttonLoading.value = true;
    try {
        if(!match.value) throw Error('Passwörter stimmen nicht überein')
        const { data, error } = await supabase.auth.updateUser({ password: password1.value });
        if(error) throw error
        showConfirmation.value = 'Hat geklappt du geile Jürgin';
        setTimeout(() => {showPwdChange.value = false}, 1500)
    } catch (error) {
        if (error instanceof Error) {
            showError.value = error.message
        }
    } finally {
        buttonLoading.value = false;
        password1.value = '';
        password2.value = '';
        match.value = true;
    }
}
</script>

<style lang="sass" scoped>
.signin-card
  width: 100%
  max-width: 500px
  border-radius: 10px

.no-match
    border-style: solid
    border-width: 2px
    border-color: red
</style>
