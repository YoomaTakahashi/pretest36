<template>
    <v-container>
        <PageHeader title="หน้าหลักผู้รับการประเมิน" subtitle="ภาพรวมระบบผู้รับการประเมิน" icon="mdi-view-dashboard" color="#7d0c14"></PageHeader>

        <v-row class="mt-3">
            <v-col cols="12" md="4" v-for="(b,i) in box" :key="b.title">
                <v-card :color="cards[i].color" variant="tonal" rounded="xl" class="pa-5">
                    <div class="d-flex align-center">
                        <v-avatar :color="cards[i]?.color" size="56" class="me-4">
                            <v-icon :icon="cards[i]?.icon" color="white" size="28"></v-icon>
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
                รอบการประเมินทั้งหมด
            </v-card-title>
            <v-table hover>
                <thead>
                    <tr>
                        <th class="text-center">ลำดับ</th>
                        <th class="text-center">ชื่อ-นามสกุล</th>
                        <th class="text-center">รอบการประเมิน</th>
                        <th class="text-center">ปีการประเมิน</th>
                        <th class="text-center">สถานะการประเมิน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in users" :key="item.id_eva">
                        <td class="text-center">{{ Number(index)+1 }}</td>
                        <td class="text-center">{{ item.fname }}-{{ item.lname }}</td>
                        <td class="text-center">{{ item.round_sys }}</td>
                        <td class="text-center">{{ item.year_sys }}</td>
                        <td class="text-center">
                            <v-chip :color="status[item.status_eva]?.color" variant="tonal" size="small" :prepend-icon="status[item.status_eva]?.icon">{{ status[item.status_eva]?.text }}</v-chip>
                        </td>
                    </tr>
                    <tr v-if="users.length === 0">
                        <td colspan="5" class="text-center text-medium-emphasis py-6">ยังไม่มีรอบการประเมิน</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva } from '~/API/base';

const users = ref<any[]>([])
const box = ref([])

const cards = [
    {color:'blue',icon:'mdi-file-document-multiple'},
    {color:'success',icon:'mdi-check-circle'},
    {color:'error',icon:'mdi-clock-alert'},
]

const status: any = {
    1: {text:'รอการประเมินตนเอง',color:'error',icon:'mdi-close'},
    2: {text:'รอกรรมการประเมิน',color:'warning',icon:'mdi-clock'},
    3: {text:'ประเมินสำเร็จ',color:'success',icon:'mdi-check-circle'},
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        const res2 = await axios.get(`${eva}/table`,{headers:{Authorization:`Bearer ${token}`}})
        users.value =res2.data
    } catch (error) {
        console.error('Error GEt',error)
    }
}
onMounted(fetch)
</script>

<style scoped>

</style>