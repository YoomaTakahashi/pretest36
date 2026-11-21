<template>
    <v-container>
        <PageHeader title="หน้าหลักฝ่ายบุคลากร" subtitle="ภาพรวมระบบฝ่ายบุคลากร" icon="mdi-view-dashboard"></PageHeader>

        <v-row class="mt-3">
            <v-col cols="12" md="4" v-for="(b,i) in box" :key="b.title">
                <v-card :color="b.color" variant="tonal" rounded="xl" class="pa-5">
                    <div class="d-flex align-center">
                        <v-avatar :color="b.color" size="56" class="me-4">
                            <v-icon :icon="b.icon" color="white" size="28"></v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-body-medium">{{ b.title }}</div>
                            <div class="text-headline-large font-weight-bold">{{ b.value }}</div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="mt-3">
            <v-col cols="12" md="4" v-for="(b,i) in box2" :key="b.title">
                <v-card :color="b.color" variant="tonal" rounded="xl" class="pa-5">
                    <div class="d-flex align-center">
                        <v-avatar :color="b.color" size="56" class="me-4">
                            <v-icon :icon="b.icon" color="white" size="28"></v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-body-medium">{{ b.title }}</div>
                            <div class="text-headline-large font-weight-bold">{{ b.value }}</div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-card rounded="xl" elevation="4" class="mt-6">
            <v-card-title class="pa-4">
                ผู้รับการประเมิน
            </v-card-title>
            <v-table class="mt-3" hover>
                <thead>
                    <tr>
                        <th class="text-center">ลำดับ</th>
                        <th class="text-center">ผู้รับการประเมินผล</th>
                        <th class="text-center">รอบการประเมิน</th>
                        <th class="text-center">วันที่ออกแบบประเมิน</th>
                        <th class="text-center">สถานะการประเมิน</th>
                        <!-- <th class="text-center">รายละเอียด</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(items,index) in users" :key="items.id_eva">
                        <td class="text-center">{{ index+1 }}</td>
                        <td class="text-center">{{ items.fname }} {{ items.lname }}</td>
                        <td class="text-center"> รอบการประเมินที่:{{ items.round_sys}} ปี:{{ items.year_sys }}</td>
                        <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                        <td class="text-center">
                            <v-chip :color="bg(items.status_eva)" :prepend-icon="icon(items.status_eva)" variant="tonal" size="small">{{ items.status_eva === 1 ? 'รอการประเมินตนเอง':items.status_eva === 2 ? 'รอกรรมการประเมิน':'ประเมินสำเร็จ' }}</v-chip>
                        </td>
                        <!-- <td class="text-center">
                            <center>
                                <v-btn rounded="circle" icon="mdi-magnify" variant="tonal" color="info" size="small" @click="go(items.id_eva)" class="ms-2"></v-btn>
                            </center>
                        </td> -->
                    </tr>
                    <tr>
                        <td class="text-center text-body-medium text-medium-emphasis" v-if="users.length === 0" colspan="12">ไม่พบข้อมูล</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva, staff } from '~/API/base';

const users = ref<any[]>([])
const box = ref([])
const box2 = ref([])

const bg = (status)=>{
    if(status === 1)return "error"
    if(status === 2)return "warning"
    if(status === 3)return "success"
}

const icon = (status)=>{
    if(status === 1)return "mdi-close"
    if(status === 2)return "mdi-clock"
    if(status === 3)return "mdi-check-circle"
}

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}


const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/staff`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        box2.value = res.data.box2
        const res2 = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        users.value =res2.data
    } catch (error) {
        console.error('Error GEt',error)
    }
}
onMounted(fetch)
</script>

<style scoped>

</style>