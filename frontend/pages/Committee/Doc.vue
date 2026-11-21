ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="คู่มือการประเมิน" icon="mdi-file-pdf-box" subtitle="จัดการเอกสารการประเมิน" color="#007fff"></page-header>

                    <v-card rounded="xl" elevation="5" class="mt-4">
                        <h3 class="font-weight-bold"><v-icon icon="mdi-file-pdf-box" class="ms-2"></v-icon>คู่มือการประเมิน</h3>
                        <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ma-3"></v-text-field>
                        <v-divide></v-divide>
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อเอกสาร</th>
                                    <th class="text-center">วันที่ออกเอกสาร</th>
                                    <th class="text-center">เอกสาร</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.name_doc }}</td>
                                    <td class="text-center">{{ formatDate(items.day_doc) }}</td>
                                    <td class="text-center">
                                        <v-btn rounded="circle" icon="mdi-eye" size="small" variant="tonal" color="info" @click="view(items.file)"></v-btn>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" v-if="result.length === 0" colspan="12">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'
const error = ref<Record<string,string>>({})
const file = ref<File | null>(null)
const dataResult = ref([])
const name_doc = ref('')


const token = import.meta.client ? localStorage.getItem('token'):null


const fetch = async()=>{
    try {
        const res = await axios.get(`${api}/docnoe/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}




const search = ref('')
const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()
    return dataResult.value.filter((items:any)=>{
        return(
            items.name_doc.toLowerCase().includes(s)
        )
    })
})

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