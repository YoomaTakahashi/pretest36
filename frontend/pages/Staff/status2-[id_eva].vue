ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header  title="สถานะการประเมินของกรรมการประเมิน" icon="mdi-progress-check" subtitle="ตรวจสอบสถานะการประเมินของกรรมการประเมิน"></page-header>
                    <v-card class="mb-4" rounded="xl" elevation="12">
                        <v-list bg-color="transparent" density="compact">
                            <v-list-item :title="`ผู้รับการประเมิน: ${header.fname} ${header.lname}`" :subtitle="`รอบการประเมิน: ${header.round_sys} ปี:${header.year_sys}`" class="pa-4"></v-list-item>
                        </v-list>
                    </v-card>
                    <v-card rounded="xl" elevation="5" class="mt-4">
                        <h3 class="font-weight-bold"><v-icon icon="mdi-progress-check" class="ms-2"></v-icon>สถานะการประเมินของกรรมการประเมิน</h3>
                        <!-- <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ma-3"></v-text-field> -->
                        <v-divide></v-divide>
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">กรรมการประเมิน</th>
                                    <th class="text-center">ตำแหน่ง</th>
                                    <th class="text-center">สถานะการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_commit">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ items.fname }} {{ items.lname }}</td>
                                    <td class="text-center">{{ items.level_commit }}</td>
                                    <td class="text-center">
                                        <v-chip :color="bg(items.status_commit)" :prepend-icon="icon(items.status_commit)" variant="tonal" size="small">{{ items.status_commit === 'y' ? 'ประเมินสำเร็จ':'รอการประเมิน'}}</v-chip>
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
import { api, staff } from '~/API/base'
const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const result = ref([])
const header = ref<any>([])
const round = ref<any>([])
const form = ref({
    id_eva:null,
    id_member:'',
    id_sys:'',
    day_eva:''
})
const reset = ()=>{
    form.value = {
        id_eva:null,
        id_member:'',
        id_sys:'',
        day_eva:''
    }
}
function validate(){
    error.value = {}
    const f = form.value

    if(!f.id_member)error.value.id_member = 'กรุณาเลือกผู้รับการประเมินผล'
    if(!f.id_sys)error.value.id_sys = 'กรุณาเลือกรอบการประเมิน'
    if(!f.day_eva)error.value.day_eva = 'กรุณากรอกวันที่ออกแบบประเมิน'


    return Object.keys(error.value).length === 0

}

const id_eva = useRoute().params.id_eva
const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_eva
        ? await axios.put(`${staff}/eva/update/${f.id_eva}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/eva/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
        alert("ดำเนินการสำเร็จ")
    } catch (error) {
        console.error("error save",error)
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/status/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
        const res2 = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res2.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}

const edit = async(items:any)=>{
    try {
        form.value = {...items}
    } catch (error) {
        console.error("error get",error);
        
    }
}

const del = async(id_eva:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/eva/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const search = ref('')

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}

const go = (id_eva)=>{
    navigateTo({path:`/Staff/status2-${id_eva}`})
}

const bg = (status)=>{
    if(status === 'n')return "error"
    if(status === 'y')return "success"
}

const icon = (status)=>{
    if(status === 'n')return "mdi-close"
    if(status === 'y')return "mdi-check-circle"
}



onMounted(fetch)
</script>

<style scoped>

</style>