import { defineStore } from 'pinia';
import useSupabase from 'boot/supabase';
import { ref } from 'vue'
import { LocalStorage, date } from 'quasar'
import CryptoJS from 'crypto-js'

export const useProfileStore = defineStore('profile', () => {
    
    const { supabase } = useSupabase();

    const MAGIC = 'IAMADIGITALJUERGENSID';

    const id = ref();
    const name = ref();
    const membership_num = ref();
    const birthday = ref();
    const date_of_issue = ref();
    const rank = ref();

    const qrData = ref();

    const loading = ref(false);
    const isLoaded = ref(false);
    const error = ref(false);

    const isCheckedState = ref(0); // 0: not checked, 1: checking, 2: checked

    async function fetchProfile() {
        loading.value = true;
        error.value = false;
        
        try{
            const { data: profiles, err } = await supabase
                .from('profiles')
                .select('*');
            
            if (err) throw err;
    
            id.value = profiles[0].id;
            name.value = profiles[0].name;
            membership_num.value = profiles[0].membership_num;
            birthday.value = profiles[0].birthday;
            date_of_issue.value = profiles[0].date_of_issue;
            rank.value = profiles[0].rank;
    
            qrData.value = CryptoJS.AES.encrypt(MAGIC + '&#&' + id.value + '&#&' + name.value, 'hallo asdasd sdf').toString();
            isLoaded.value = true;
    
            testCheck();
    
            const changes = supabase
            .channel('new_id_checks')
            .on(
                'postgres_changes',
                {
                event: 'INSERT',
                schema: 'public',
                table: 'id_checks',
                filter: `owner_id=eq.${id.value}`,
                },
                (payload) => {
                    isCheckedState.value = 1;
                    setTimeout(() => isCheckedState.value = 2, 2500);
                }
            ).subscribe()

        }catch(err){
            error.value = true;
            isLoaded.value = false
            resetValues();
            
            console.error(err.message);
        }finally{
            loading.value = false;
        }
    }

    async function fetchProfileOnce() {
        if(!isLoaded.value){
            this.fetchProfile();
        }
    }

    const resetValues = () => {
        id.value = 0;
        name.value = '---';
        membership_num.value = '---';
        birthday.value = undefined;
        date_of_issue.value = undefined;
        rank.value = '---';

        qrData.value = 'This is an Error QR code';
    }
    resetValues();

    const testCheck = async () => {
        isCheckedState.value = 1;
        const {data: id_checks, err} = await supabase
            .from('id_checks')
            .select("*")
            .eq('owner_id', id.value)
            .order('inspected_at', { ascending: false })
            .limit(1);
            
        if(err || !id_checks || id_checks.length < 1){
            isCheckedState.value = 0;
            return;
        } 

        if (date.isValid(id_checks[0].inspected_at)){
            const age = date.getDateDiff(Date.now(), id_checks[0].inspected_at, 'minutes')
            console.log(age)
            if(age < 2){
                setTimeout(() => isCheckedState.value = 2, 400);
                return
            }
        }
        setTimeout(() => isCheckedState.value = 0, 1000);
    }
    setInterval(() => {
        if(isCheckedState.value == 2) testCheck();
    }, 60000); // Check every minute

    const logout = async () => {
        let { error } = await supabase.auth.signOut();
        isLoaded.value = false;
        resetValues();
    }

    return {id, MAGIC, name, membership_num, birthday, date_of_issue, rank, qrData, loading, isLoaded, isCheckedState, error, fetchProfile, fetchProfileOnce, logout}

});

