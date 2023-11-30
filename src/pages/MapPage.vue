<template>
    <q-page>
        <q-card v-if="showError" class="errorBox bg-red-8 text-white">
            <q-card-section class="text-subtitle2">
                {{ errorMessage }}
            </q-card-section>
        </q-card>
        
        <div id="map"></div>
        <q-btn icon="my_location" round size="lg" color="white" @click="locate" class="locationButton text-blue-8 q-ma-xs" />
    </q-page>
</template>

<script setup>
    import "leaflet/dist/leaflet.css"
    import L from 'leaflet'

    import "leaflet.markercluster/dist/MarkerCluster.css"
    import "leaflet.markercluster/dist/MarkerCluster.Default.css"
    import 'leaflet.markercluster'
    
    import { ref, onMounted } from 'vue'
    import { date } from 'quasar'
    import { useProfileStore } from 'src/stores/profileStore'
    import { useLocationStore } from 'src/stores/locationStore'

    const profile = useProfileStore();
    const location = useLocationStore();

    const errorMessage = ref('');
    const showError = ref(false);

    let map;
    let locationMarker;
    let locationMarkerAccuracy;

    onMounted(async () => {

        map = L.map('map', {
            zoomSnap: 0,
            zoomDelta: 1,
            zoomControl: false,
            inertia: true,
            inertiaDeceleration: 900,
            tapTolerance: 15,
            touchZoom: true,
            worldCopyJump: true,
        }).setView([51.1642292, 10.4541194], 3.5)

        L.control.zoom({
            position: 'bottomleft'
        }).addTo(map);
        
        L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        if(location.latitude && location.longitude) {
            map.setView([location.latitude, location.longitude], 16)
        }

        map.on('moveend', () => { 
            // console.log(map.getBounds().getNorthWest());
            // console.log(map.getBounds().getSouthEast());
        });

        setInterval(() => {
            if(location.error){
                errorMessage.value = location.error.message;
                showError.value = true;
                return
            }
            if(location.latitude && location.longitude) {
                errorMessage.value = ''
                showError.value = false;
                if(!locationMarker){
                    locationMarker = L.marker([location.latitude, location.longitude], {
                        icon: L.divIcon({html: `<span class="locationMarker pulse"/>`, className: ''})
                    }).addTo(map);
                    locationMarkerAccuracy = L.circle([location.latitude, location.longitude], {
                        radius: location.accuracy, stroke: false
                    }).addTo(map);
                }
                else{
                    locationMarker.setLatLng([location.latitude, location.longitude])
                    locationMarkerAccuracy.setLatLng([location.latitude, location.longitude])
                    locationMarkerAccuracy.setRadius(location.accuracy)
                }
            }
            else {
                errorMessage.value = 'Currently, no position available'
                showError.value = true;
            }
        }, 1000)

        var checkLocationIcon = L.icon({
            iconUrl: '/map-icons/check_location.svg',
            iconSize: [72, 72],
            iconAnchor: [36, 71],
            popupAnchor: [3, -72],
        });

        await location.fetchIdChecks();
        let markers = L.markerClusterGroup();

        for (let i = 0; i < location.id_checks_in_view.length; i++) {
            let id_check = location.id_checks_in_view[i];

			let marker = L.marker([id_check.lat, id_check.long], { icon: checkLocationIcon });
            marker.bindPopup(`
                <u>Digitale Ausweiskontrolle</u> <br/> 
                <h6 style="margin: 0; font-size: 16px;">${id_check.inspector_name}</h6> verifiziert <h6 style="margin: 0; font-size: 16px;">${id_check.owner_name}</h6> <br/> 
                <br/> 
                Verifiziert vor ${date.getDateDiff(Date.now(), id_check.inspected_at, 'days')} Tagen <br/>
                am <b>${date.formatDate(id_check.inspected_at, 'DD.MM.YYYY')}</b> um <b>${date.formatDate(id_check.inspected_at, 'HH:MM')}</b> Uhr
            `);
			markers.addLayer(marker);
		}
		map.addLayer(markers);
    })


    const locate = () => {
        if(location.latitude && location.longitude){
            map.flyTo([location.latitude, location.longitude], 16, {duration: 1.5})
        }
        else{
            errorMessage.value = 'Currently, no position available'
            showError.value = true;
        }
    }


</script>

<style lang="sass" scoped>
#map
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    z-index: 0

.locationButton
    position: absolute
    z-index: 10
    right: 15px
    bottom: 25px

</style>

<style lang="scss">
.errorBox{
    z-index: 10;
    width: 100%;
    top: 0px;
}

.locationMarker{
    width: 15px;
    height: 15px;
    border-color: white;
    border-style: solid;
    border-width: 1px;
    background: $blue-8;
    color: $blue-8;
    box-shadow: 0 0 0 $blue-8;
}

.pulse{
    display: block;
    border-radius: 50%;
    cursor: pointer;
    animation: pulse 2s infinite;
}
    
@keyframes pulse {
    0% {
    -moz-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 0;
    }
    70% {
    -moz-box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }
    100% {
    -moz-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}

</style>