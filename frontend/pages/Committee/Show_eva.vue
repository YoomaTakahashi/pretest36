ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="ดำเนินการประเมิน" icon="mdi-account-group" subtitle="เลือกผู้รับการประเมินเพื่อประเมิน" color="#007fff"></page-header>

                    <v-card rounded="xl" elevation="5" class="mt-4">
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">ชื่อ</th>
                                    <th class="text-center">นามสกุล</th>
                                    <th class="text-center">วันที่ออกแบบการประเมิน</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">สถานะการประเมิน</th>
                                    <th class="text-center">ดำเนินการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }}</td>
                                    <td class="text-center">{{ items.lname }}</td>
                                    <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                                    <td class="text-center">รอบที่: {{ items.round_sys }} / ปี: {{ items.year_sys }}</td>
                                    <td class="text-center">
                                        <v-chip :color="bg(items.status_eva)" :prepend-icon="icon(items.status_eva)" variant="tonal" size="small">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง':items.status_eva === 2 ? 'รอกรรมการประเมิน':'ประเมินสำเร็จ' }}</v-chip>
                                    </td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn color="info" class="text-center text-white" variant="outlined" size="small" prepend-icon="mdi-pen" @click="go(items.id_eva)" rounded="lg">ดำเนินการประเมิน</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-body-medium text-medium-emphasis" v-if="result.length === 0" colspan="12">ไม่พบข้อมูล</td>
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
import { compile } from 'vue'
import { api, commit, staff } from '~/API/base'
import PageHeader from '~/components/PageHeader.vue'
const error = ref<Record<string,string>>({})
const file = ref<File | null>(null)
const dataResult = ref([])
const name_doc = ref('')

const bg = (status:any)=>{
    if(status === 1)return "error"
    if(status === 2)return "warning"
    if(status === 3)return "success"
}

const icon = (status:any)=>{
    if(status === 1)return "mdi-close"
    if(status === 2)return "mdi-clock"
    if(status === 3)return "mdi-check-circle"
}


const reset = ()=>{
    name_doc.value = ''
    file.value = null
}


const token = import.meta.client ? localStorage.getItem('token'):null



const fetch = async()=>{
    try {
        const res = await axios.get(`${commit}/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}




const result = ref([])

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}

const go = (id_eva:number)=>{
    navigateTo({path:`/Committee/Save_score/${id_eva}`})
}


onMounted(fetch)
</script>

<style scoped>

</style>