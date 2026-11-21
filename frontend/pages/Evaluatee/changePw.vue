<template>
    <v-container style="max-width: 560px;">
        <PageHeader title="เปลี่ยนรหัสผ่านครั้งแรก" subtitle="เปลี่ยนรหัสผ่านครั้งแรกของผู้รับการประเมิน" icon="mdi-lock-reset" color="#7d0c14"></PageHeader>
        <v-card rounded="xl" elevation="5" class="pa-4">
            <v-form @submit.prevent="save">
                <v-text-field label="รหัสผ่านเดิม" v-model="form.oldPw" :error-messages="error.oldPw" variant="outlined" prepend-inner-icon="mdi-lock-outline" :append-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                <v-text-field label="รหัสผ่านใหม่" v-model="form.newPw" :error-messages="error.newPw" variant="outlined" prepend-inner-icon="mdi-lock" :append-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" :type="show2 ? 'text':'password'" @click:append-inner="show2 = !show2"></v-text-field>
                <v-text-field label="ยืนยันรหัสผ่าน" v-model="confirm" :error-messages="error.confirm" variant="outlined" prepend-inner-icon="mdi-lock-check" :append-inner-icon="showPw ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:append-inner="showPw = !showPw"></v-text-field>
                <v-btn color="#7d0c14" prepend-icon="mdi-content-save" block type="submit">เปลี่ยนรหัสผ่าน</v-btn>
            </v-form>
        </v-card>
        
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api } from '~/API/base';

definePageMeta({layout:false})

const form = ref({
    oldPw:'',
    newPw:''
})

const error = ref<Record<string,string>>({})
const show = ref(false)
const showPw = ref(false)
const show2 = ref(false)
const confirm = ref('')

function validate(){
    error.value = {}
    if(!form.value.oldPw)error.value.oldPw = 'กรุณากรอกรหัสผ่านเดิม'
    if(form.value.newPw.trim().length < 6)error.value.newPw = 'รหัสผ่านต้องมีอักขระอย่างน้อย 6 ตัว'
    else if(form.value.newPw === form.value.oldPw)error.value.newPw = 'รหัสผ่านต้องไม่ซ้ำหับรหัสผ่านเดิม'
    if(confirm.value !== form.value.newPw) error.value.confirm = 'รหัสผ่านไม่ตรงกัน'
    return Object.keys(error.value).length === 0

}

const save = async()=>{
    const token = localStorage.getItem('token')
    if(!validate())return 
    try {
        await axios.put(`${api}/auth/changePw`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert("เปลี่ยนรหัสผ่านสำเร็จ")
        navigateTo('/Evaluatee')
    } catch (error) {
        console.error("error save",error)
        const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        :null
        alert(message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองอีกครั้ง')
    }
}
</script>

<style scoped>

</style>