<template>
    <v-container>
        <PageHeader title="ผลการประเมินที่ท่านประเมิน" subtitle="คะแนนที่ประเมินผู้รับการประเมินเป็นผลสรุปของท่าน" icon="mdi-account-check" color="#007fff"></PageHeader>

        <v-form v-if="user.status_commit === 'y'">
            <v-card rounded="xl" class="mb-6" elevation="4">
                <v-list-item prepend-icon="mdi-account-circle" :title="`${user.fname}-${user.lname}`" :subtitle="`รอบการประเมิน : ${user.round_sys} /ปี ${user.year_sys}`" ></v-list-item>
            </v-card>

            <v-card rounded="xl" class="mb-4" v-for="(topic,t) in topics" :key="topic.id_topic">
                <v-card-title class="pa-4 bg-grey">{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>
                <v-table hover>
                    <thead>
                        <tr>
                            <th class="text-center">ลำดับหัวข้อ</th>
                            <th class="text-center">ชื่อตัวชี้วัด</th>
                            <th class="text-center">รายละเอียดตัวชี้วัด</th>
                            <th class="text-center">น้ำหนักคะแนน</th>
                            <th class="text-center">คะแนนเต็ม</th>
                            <th class="text-center">คะแนนที่ได้</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                            <td class="text-center">{{ Number(i)+1 }}</td>
                            <td class="text-center">{{ indicate.name_indicate }}</td>
                            <td class="text-center">{{ indicate.detail_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate }}</td>
                            <td class="text-center">{{ indicate.point_indicate*4 }}</td>
                            <td class="text-center">{{ indicate.score_member*indicate.point_indicate }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
            <div class="text-end">
                <v-alert color="green" rounded="xl" size="large" prepend-icon="mdi-content-save"><v-icon icon="mdi-trophy"></v-icon>คะแนนรวม : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-alert>
            </div>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_commit === 'n'" rounded="xl" variant="tonal">รอการดำเนินการ</v-alert>
        <v-alert type="error" v-else rounded="xl" variant="tonal">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { commit } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])

const id_eva = useRoute().params.id_eva

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/score_commit/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${commit}/score_commit/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
    } catch (error) {
        console.error('Error GEt',error)
    }
}
onMounted(fetch)



</script>

<style scoped>

</style>