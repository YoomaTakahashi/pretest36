ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header class="mb-4" title="จัดการแบบประเมิน" icon="mdi-file-document-edit" subtitle="เลือกผู้รับการประเมินและรอบการประเมิน"></page-header>
                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <h3 class="font-weight-bold"><v-icon :icon="form.id_eva ? 'mdi-pencil':'mdi-plus'"></v-icon>จัดการแบบประเมิน</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select label="ผู้รับการประเมินผล" v-model="form.id_member" :error-messages="error.id_member" variant="outlined" :items="eva.map((t)=>({title:`${t.fname} ${t.lname}`,value:t.id_member}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select label="รอบการประเมิน" v-model="form.id_sys" :error-messages="error.id_sys" variant="outlined" :items="round.map((t)=>({title:`รอบการประเมินที่:${t.round_sys} ปี:${t.year_sys}`,value:t.id_sys}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="วันที่ออกแบบประเมิน" v-model="form.day_eva" :error-messages="error.day_eva" type="date" variant="outlined"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-content-save" type="submit" color="primary">{{ form.id_eva ? 'อัปเดต':'บันทึก' }}</v-btn>
                                            <v-btn class=" text-center text-white" prepend-icon="mdi-close" @click="reset()"  color="error" variant="tonal">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card rounded="xl" elevation="5">
                                <h3 class="font-weight-bold">แบบประเมิน</h3>
                                <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ma-3"></v-text-field>
                                <v-divide></v-divide>
                                <v-table class="mt-3" hover>
                                    <thead>
                                        <tr>
                                            <th class="text-center">ลำดับ</th>
                                            <th class="text-center">ผู้รับการประเมินผล</th>
                                            <th class="text-center">รอบการประเมิน</th>
                                            <th class="text-center">วันที่ออกแบบประเมิน</th>
                                            <th class="text-center">เพิ่มกรรมการ</th>
                                            <th class="text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(items,index) in result" :key="items.id_eva">
                                            <td class="text-center">{{ index+1 }}</td>
                                            <td class="text-center">{{ formatDate(items.day_eva) }}</td>
                                            <td class="text-center"> รอบการประเมินที่:{{ items.round_sys}} ปี:{{ items.year_sys }}</td>
                                            <td class="text-center">
                                                <v-btn rounded="circle" icon="mdi-account-plus" variant="tonal" color="success" @click="go(items.id_eva)"></v-btn>
                                            </td>
                                            <td class="text-center">
                                                <center>
                                                    <v-btn rounded="circle" icon="mdi-pencil" variant="tonal" color="warning" @click="edit(items)" class="ms-2"></v-btn>
                                                    <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" @click="del(items.id_sys)" class="ms-2"></v-btn>
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
import { api, staff } from '~/API/base'
const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const dataResult = ref([])
const eva = ref<any>([])
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
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
        const res2 = await axios.get(`${staff}/member/show`,{headers:{Authorization:`Bearer ${token}`}})
        eva.value = res2.data
        const res3 = await axios.get(`${staff}/system/showY`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = res3.data

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
const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()
    return dataResult.value.filter((items:any)=>{
        return(
            items.fname.toLowerCase().includes(s) ||
            items.lname.toLowerCase().includes(s)
        )
    })
})

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}

const go = (id_eva)=>{
    navigateTo({path:`/Staff/commit-eva-${id_eva}`})
}



onMounted(fetch)
</script>

<style scoped>

</style>