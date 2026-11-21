ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header class="mb-4" title="คู่มือการประเมิน" icon="mdi-file-pdf-box" subtitle="จัดการเอกสารการประเมิน"></page-header>

                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <h3 class="font-weight-bold"><v-icon :icon="form.id_doc ? 'mdi-pencil':'mdi-plus'"></v-icon>เอกสารหรือคู่มือการประเมินผล</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="ชื่อเอกสาร" v-model="name_doc" :error-messages="error.name_doc" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-file-input label="ไฟล์เอกสาร" v-model="file" :error-messages="error.file" variant="outlined" accept=".pdf,.docx" hint="รองรับเฉพาะไฟล์ PDF หรือ DOCX ขนาดไม่เกิน 10MB"></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-content-save" type="submit" rounded="lg" color="primary">{{ form.id_doc ? 'อัปเดต':'บันทึก' }}</v-btn>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-close" @click="reset()" rounded="lg" color="error" variant="tonal">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card rounded="xl" elevation="5">
                                <h3 class="font-weight-bold"><v-icon icon="mdi-file-pdf" class="ms-2"></v-icon>เอกสารหรือคู่มือการประเมิน</h3>
                                <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ma-3"></v-text-field>
                                <v-divide></v-divide>
                                <v-table class="mt-3" hover>
                                    <thead>
                                        <tr>
                                            <th class="text-center">ลำดับ</th>
                                            <th class="text-center">ชื่อเอกสาร</th>
                                            <th class="text-center">วันที่ออกเอกสาร</th>
                                            <th class="text-center">เอกสาร</th>
                                            <th class="text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(items,index) in result" :key="items.id_doc">
                                            <td class="text-center">{{ index+1 }}</td>
                                            <td class="text-center">{{ items.fname }} {{ items.lname }}</td>
                                            <td class="text-center">{{ formatDate(items.day_doc) }}</td>
                                            <td class="text-center">
                                                <v-btn rounded="circle" icon="mdi-eye" variant="tonal" color="info" @click="view(items.file)"></v-btn>
                                            </td>
                                            <td class="text-center">
                                                <center>
                                                    <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" @click="del(items.id_eva)" class="ms-2"></v-btn>
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
import { api, commit, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const file = ref<File | null>(null)
const dataResult = ref([])


const reset = ()=>{
    name_doc.value = ''
    file.value = null
}


const token = import.meta.client ? localStorage.getItem('token'):null



const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/doc/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}




const search = ref('')
const result = ref([])

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}

const view = (filename:string)=>{
    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>