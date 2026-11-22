ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="ยืนยันการประเมิน" icon="mdi-file-png-box" subtitle="ยืนยันการประเมินเผื่อสรุปผลคะแนน" color="#007fff"></page-header>

                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <h3 class="font-weight-bold">แนบลายเซ็นเผื่อยืนยัน</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form v-if="!result.signature" @submit.prevent="saveMember">
                                <v-row>
                                    <!-- <v-col cols="12" md="6">
                                        <v-text-field label="ชื่อเอกสาร" v-model="name_doc" :error-messages="error.name_doc" variant="outlined"></v-text-field>
                                    </v-col> -->
                                    <v-col cols="12" md="12">
                                        <v-file-input label="ไฟล์เอกสาร" v-model="file" :error-messages="error.file" variant="outlined" accept=".png,.jpg" hint="รองรับเฉพาะไฟล์ PNG หรือ JPG ขนาดไม่เกิน 10MB"></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white ma-2" variant="outlined" prepend-icon="mdi-content-save" type="submit" rounded="lg" color="primary">บันทึก</v-btn>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-close" @click="reset()" rounded="lg" color="error" variant="outlined">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card v-else rounded="xl" elevation="5" class="mt-4">
                        <h3 class="font-weight-bold"><v-icon icon="mdi-file-png-box" class="ms-2"></v-icon>ลายเซ็นที่แนบ</h3>
                        <v-divide></v-divide>
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อเอกสาร</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td class="text-center">{{ 1 }}</td>
                                    <td class="text-center">{{ result.signature }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn rounded="circle" icon="mdi-eye" size="small" variant="tonal" color="info" @click="view(result.signature)"></v-btn>
                                            <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" size="small" @click="del()" class="ms-2"></v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" v-if="result.length === 0" colspan="12">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                            
                        </v-card-text>
                    </v-card>
                    
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { compile } from 'vue'
import { api, staff,commit } from '~/API/base'
import PageHeader from '~/components/PageHeader.vue'
const error = ref<Record<string,string>>({})
const file = ref<File | null>(null)
const dataResult = ref([])
const name_doc = ref('')
const id_eva = useRoute().params.id_eva
const reset = ()=>{
    file.value = null
}
function validate(){
    error.value = {}
    if(!file.value)error.value.file = 'กรุณาเลือกไฟล์เอกสาร'
    return Object.keys(error.value).length === 0
}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const maxSize = 10*1024*1024
    if(file.value?.size > maxSize){
        alert('ไฟล์มีขนาดเกิน 10MB')
    }
    const formdata = new FormData
    formdata.append('file',file.value!)
    try {
        await axios.post(`${commit}/signature/save/${id_eva}`,formdata,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
        alert("ดำเนินการสำเร็จ")
    } catch (error) {
        console.error("error save",error)
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${commit}/signature/show/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}


const del = async()=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${commit}/signature/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}


const result = ref([])



const view = (filename:string)=>{
    const url = new URL(`/uploads/signature/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>