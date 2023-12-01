import { defineStore } from 'pinia';
import useSupabase from 'boot/supabase';
import { ref } from 'vue'
import { date } from 'quasar'
import CryptoJS from 'crypto-js'

export const useProfileStore = defineStore('profile', () => {

    const { supabase } = useSupabase();

    // Magic must be first part of the qr code to identify a DJID
    const MAGIC = 'IAMADIGITALJUERGENSID';

    const id = ref();
    const name = ref();
    const membership_num = ref();
    const birthday = ref();
    const date_of_issue = ref();
    const rank = ref();
    const fiscal_year = ref();

    const avatar_src = ref();

    const qrData = ref();
    const qrKey = ref();

    const loading = ref(false);
    const loadingAvatar = ref(false);
    const isLoaded = ref(false);
    const error = ref(false);
    let justLoadedAvatar = false;

    const isCheckedState = ref(0); // 0: not checked, 1: checking, 2: checked
    const minutes_keep_checked = ref(2);

    async function fetchProfile() {
        loading.value = true;
        error.value = false;

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const { data: profile, err } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            if (err) throw err;

            const { data: general, err2 } = await supabase
                .from('general')
                .select('*');
            if (err2) throw err2; 1

            id.value = profile.id;
            name.value = profile.name;
            membership_num.value = profile.membership_num;
            birthday.value = profile.birthday;
            date_of_issue.value = profile.date_of_issue;
            rank.value = profile.rank;
            fiscal_year.value = general.filter((elmnt) => elmnt.name === 'fiscal_year')[0].value;

            qrKey.value = general.filter((elmnt) => elmnt.name === 'qr_key')[0].value;
            qrData.value = CryptoJS.AES.encrypt(MAGIC + '&#&' + id.value + '&#&' + name.value, qrKey.value).toString();
            isLoaded.value = true;

            minutes_keep_checked.value = Number(general.filter((elmnt) => elmnt.name === 'minutes_keep_checked')[0].value);

            // Prevent loading avatar from backend if it was changed just before since backend needs some time
            // to update image and returns old image for a while.
            if (!justLoadedAvatar) {
                downloadImage();
            }

            testCheck();

            // Subscribe to realtime database changes to get notified if profile is verified
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

        } catch (err) {
            error.value = true;
            isLoaded.value = false
            resetValues();

            console.error(err.message);
        } finally {
            loading.value = false;
        }
    }

    async function fetchProfileOnce() {
        if (!isLoaded.value) {
            loadingAvatar.value = true;
            await this.fetchProfile();
            loadingAvatar.value = false;
        }
    }

    const resetValues = () => {
        id.value = 0;
        name.value = '---';
        membership_num.value = '---';
        birthday.value = undefined;
        date_of_issue.value = undefined;
        rank.value = '---';
        fiscal_year.value = '---';

        qrData.value = 'This is an Error QR code';
    }
    resetValues();

    // Function checks if user was verified (id checked) in the last minutes
    const testCheck = async () => {
        isCheckedState.value = 1;
        const { data: id_checks, err } = await supabase
            .from('id_checks')
            .select("*")
            .eq('owner_id', id.value)
            .order('inspected_at', { ascending: false })
            .limit(1);

        if (err || !id_checks || id_checks.length < 1) {
            isCheckedState.value = 0;
            return;
        }

        if (date.isValid(id_checks[0].inspected_at)) {
            const age = date.getDateDiff(Date.now(), id_checks[0].inspected_at, 'minutes')
            console.log(age + " < " + minutes_keep_checked.value)
            if (age < minutes_keep_checked.value) {
                setTimeout(() => isCheckedState.value = 2, 400);
                return
            }
        }
        setTimeout(() => isCheckedState.value = 0, 1000);
    }
    setInterval(() => {
        if (isCheckedState.value == 2) testCheck();
    }, 60000); // Check every minute if user is still checked

    const logout = async () => {
        let { error } = await supabase.auth.signOut();
        isLoaded.value = false;
        resetValues();
    }

    const downloadImage = async () => {
        try {
            let { data, error } = await supabase.storage.from('avatars').download(id.value)
            if (error) {
                let { data, error } = await supabase.storage.from('avatars').download('default');
                if (error) throw error
            }
            avatar_src.value = URL.createObjectURL(data)
        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }

    const uploadAvatar = async (blob) => {
        loadingAvatar.value = true;
        try {
            const { error: uploadError } = await supabase
                .storage
                .from('avatars')
                .upload(id.value, blob, { upsert: true })
            if (uploadError) throw uploadError

            avatar_src.value = URL.createObjectURL(blob)
        } catch (error) {
            console.log(error.message)
        } finally {
            loadingAvatar.value = false
            justLoadedAvatar = true;
            setTimeout(() => justLoadedAvatar = false, 60000);
        }
    }

    return {
        id, MAGIC, name, membership_num, birthday, date_of_issue, rank,
        fiscal_year, avatar_src, qrData, qrKey, loading, loadingAvatar, isLoaded, isCheckedState, error,
        fetchProfile, fetchProfileOnce, logout, uploadAvatar
    }

});

