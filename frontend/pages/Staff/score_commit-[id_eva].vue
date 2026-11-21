<template>
    <v-container>
        <PageHeader title="ผลการประเมินของกรรมการประเมิน" subtitle="คะแนนจากประธาน กรรมการ และเลขา แยกตามหัวข้อ" icon="mdi-account-group"></PageHeader>

        <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
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
                            <th class="text-center">ประธาน</th>
                            <th class="text-center">กรรมการ</th>
                            <th class="text-center">เลขา</th>
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
                            <td class="text-center">{{ scores[indicate.id_indicate]?. a ?? 'รอประธานประเมิน' }}</td>
                            <td class="text-center">{{ scores[indicate.id_indicate]?. b ?? 'รอกรรมการประเมิน' }}</td>
                            <td class="text-center">{{ scores[indicate.id_indicate]?. c ?? 'รอเลขาระเมิน' }}</td>
                            <td class="text-center">{{ average(indicate.id_indicate) }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
            <div class="text-end">
                <v-alert color="green" rounded="xl" size="large" prepend-icon="mdi-content-save"><v-icon icon="mdi-trophy"></v-icon>คะแนนรวม : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-alert>
            </div>

            <v-card class="mt-4" rounded="xl" elevation="3">
                <v-card-title class="pa-4">
                    <v-icon icon="mdi-comment-text-multiple" color="#647687" class="me-2"></v-icon>
                    ข้อเสนอแนะของกรรมการ
                </v-card-title>
                <v-list>
                    <v-list-item v-for="commit in commits" :key="commit.id_commit" :title="commit.level_commit" :subtitle="commit.detail_commit || 'รอการประเมิน'" prepend-icon="mdi-account-tie"></v-list-item>
                </v-list>
            </v-card>
        </v-form>
        <v-alert color="warning" type="warning" v-else-if="user.status_eva === 1" rounded="xl" variant="tonal">ยังไม่ได้ประเมินตนเอง</v-alert>
        <v-alert type="error" v-else rounded="xl" variant="tonal">ไม่มีแบบประเมิน</v-alert>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, commit, eva, staff } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])
const commits = ref<any>([])
const scores = ref<any>([])

const id_eva = useRoute().params.id_eva

const average = (id: number)=>{
    const s = scores.value[id] ?? {}
    return (((s.a ?? 0)+ (s.b ?? 0) + (s.c ?? 0))/3).toFixed(2)
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${staff}/score_member/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
        const res2 = await axios.get(`${staff}/score_commit/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res2.data
        const res3 = await axios.get(`${staff}/score_commit/scores/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res3.data
        const res4 = await axios.get(`${staff}/score_commit/commit/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res4.data
    } catch (error) {
        console.error('Error GEt',error)
    }
}
onMounted(fetch)

</script>

<style scoped>

</style>