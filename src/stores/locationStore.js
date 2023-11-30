import { defineStore } from 'pinia';
import useSupabase from 'boot/supabase';
import { ref } from 'vue'


export const useLocationStore = defineStore('location', () => {

    const { supabase } = useSupabase();

    const latitude = ref();
    const longitude = ref();
    const accuracy = ref();

    const id_checks_in_view = ref();

    const error = ref('');

    let watchID;
    const startTracking = () => {
        watchID = navigator.geolocation.watchPosition(
            (pos) => { // On success callback
                latitude.value = pos.coords.latitude;
                longitude.value = pos.coords.longitude;
                accuracy.value = pos.coords.accuracy;
                error.value = '';
                console.log('Updating location to lat: ', latitude.value, 'lng: ', longitude.value)
            }, (err) => { // On error callback
                error.value = err;
            },
            { // Options
                enableHighAccuracy: true
            }
        );
    }

    const stopTracking = () => {
        navigator.geolocation.clearWatch(watchID);
    }


    const fetchIdChecks = async () => {

        try {
            // const { data: id_checks, err } = await supabase
            //     .from('id_checks')
            //     .select('*');

            const { data: id_checks, err } = await supabase.rpc('id_checks_in_view', {
                // min_lat: 28.32144256195213,
                // min_long: -12.517321217427744,
                // max_lat: 68.60332469489008,
                // max_long: 37.801541173673314,
                min_lat: 35.35067387745531,
                min_long: -8.004458935143445,
                max_lat: 64.16228690324682,
                max_long: 64.40725560386426,
            })
            if (err) throw err;

            console.log(id_checks)
            id_checks_in_view.value = id_checks;

        } catch (err) {
            error.value = err.message;
            console.error(err.message);
        }
    }

    return {
        latitude, longitude, accuracy, error, id_checks_in_view,
        startTracking, stopTracking, fetchIdChecks,
    }
});

