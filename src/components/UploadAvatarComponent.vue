<template>

    <input
      style="visibility: hidden; position: absolute"
      type="file"
      ref="fileInput"
      accept="image/*"
      @change="openCropper"
    />
    <q-dialog v-model="showUploadDialog" class="flex flex-center">  
        <q-card>
            <cropper
                class="cropper"
                ref="cropperRef"
                :stencil-component="CircleStencil"
                :src="src"
                :stencil-props="{
                    aspectRatio: 1/1
                }"
                :canvas="{
                    height: 256,
                    width: 256
                }"
            />

            <q-card-actions align="center">
                <q-btn flat label="Select Image" color="primary" ripple @click="fileInput.click()"/>
                <q-btn label="Upload" color="primary" v-close-popup ripple @click="confirmImage"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import { useProfileStore } from 'src/stores/profileStore'
    import { useRouter } from 'vue-router';
    import { ref, onMounted, computed, watch} from 'vue'
    import { CircleStencil, Cropper } from 'vue-advanced-cropper';
    import 'vue-advanced-cropper/dist/style.css';

    const profile = useProfileStore();
    const router = useRouter();

    const fileInput = ref();
    const cropperRef = ref();
    const src = ref();

    const props = defineProps(['modelValue'])
    const emit = defineEmits(['update:modelValue'])
    const showUploadDialog = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        }
    })

    watch(showUploadDialog, (newValue, oldValue) => {
        if(newValue){
            fileInput.value.click();
        }
        if(oldValue){
            src.value = null;
        }
    })

    onMounted(() => {
        // fileInput.value.click();
    })

    const openCropper = (evt) => {
        const files = evt.target.files;
        if (!files || files.length === 0) {
            console.log('You must select an image to upload.');
            return
        }
        const file = files[0]
        src.value = URL.createObjectURL(file);
    }

    const confirmImage = () => {
        const { canvas } = cropperRef.value.getResult();
		if (canvas) {
            canvas.toBlob(blob => {
                profile.uploadAvatar(blob)
            })
            router.push({name: 'user'})
        }
    }

</script>

<style>
.cropper {
	width: 300px;
	background: #DDD;
}
</style>

