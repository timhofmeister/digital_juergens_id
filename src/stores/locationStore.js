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

    // Fetch id checks within a rectangle selection on map. 
    // (min_lat, min_long) is bottom left point and (max_lat, max_long) is upper right point on map.
    const fetchIdChecks = async () => {
        try {
            const { data: id_checks, err } = await supabase.rpc('id_checks_in_view', {
                // Currently whole Europe is selected but future TODO might be dynamic selection based on view
                min_lat: 35.35067387745531,
                min_long: -8.004458935143445,
                max_lat: 64.16228690324682,
                max_long: 64.40725560386426,
            })
            if (err) throw err;
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

