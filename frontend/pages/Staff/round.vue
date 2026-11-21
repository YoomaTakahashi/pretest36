ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header title="จัดการรอบการประเมิน" icon="mdi-clock-outline" subtitle="เพิ่ม ลบ แก้ไข ข้อมูลของรอบการประเมิน"></page-header>
                    <v-card rounded="xl" elevation="12">
                        
                        <v-card-title>
                            <h3 class="font-weight-bold"><v-icon :icon="form.id_sys ? 'mdi-pencil':'mdi-plus'"></v-icon>จัดการรอบการประเมิน</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="วันที่เปิดรอบการประเมิน" v-model="form.day_open" :error-messages="error.day_open" type="date" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="วันที่ปิดรอบการประเมิน" v-model="form.day_out" :error-messages="error.day_out" type="date" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="รอบการประเมิน" v-model="form.round_sys" :error-messages="error.round_sys" type="number" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="ปีการประเมิน" v-model="form.year_sys" :error-messages="error.year_sys" type="number" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-select label="สถานะรอบการประเมิน" v-model="form.status_sys" :error-messages="error.status_sys" variant="outlined" :items="[{title:'เปิดรอบการประเมิน',value:'y'},{title:'ปิดรอบการประเมิน',value:'n'}]"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-content-save" type="submit" color="primary">{{ form.id_sys ? 'อัปเดต':'บันทึก' }}</v-btn>
                                            <v-btn class=" text-center text-white" prepend-icon="mdi-close" @click="reset()"  color="error" variant="tonal">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                           
                            
                        </v-card-text>
                    </v-card>
                     <v-card rounded="xl" elevation="5" class="mt-4">  
                        <h3 class="font-weight-bold"><v-icon icon="mdi-clock-outline" class="ms-2"></v-icon>รอบการประเมิน</h3>
                        <!-- <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ma-3"></v-text-field> -->
                        <v-divide></v-divide>
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">วันที่เปิดรอบการประเมิน</th>
                                    <th class="text-center">วันที่ปิดรอบการประเมิน</th>
                                    <th class="text-center">รอบการประเมิน</th>
                                    <th class="text-center">ปีการประเมิน</th>
                                    <th class="text-center">สถานะรอบการประเมิน</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_sys">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ formatDate(items.day_open) }}</td>
                                    <td class="text-center">{{ formatDate(items.day_out) }}</td>
                                    <td class="text-center">{{ items.round_sys}}</td>
                                    <td class="text-center">{{ items.year_sys }}</td>
                                    <td class="text-center">{{ items.status_sys === 'y' ? 'เปิดรอบการประเมิน':'ปิดรอบการประเมิน' }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn rounded="circle" icon="mdi-pencil" variant="tonal" color="warning" size="small" @click="edit(items)" class="ms-2"></v-btn>
                                            <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" size="small" @click="del(items.id_sys)" class="ms-2"></v-btn>
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
import { api, staff } from '~/API/base'
const error = ref<Record<string,string>>({})
const pic_user = ref<File | null>(null)
const result = ref([])
const topics = ref<any>([])
const form = ref({
    id_sys:null,
    day_open:'',
    day_out:'',
    round_sys:'',
    year_sys:'',
    status_sys:''
})
const reset = ()=>{
    form.value = {
        id_sys:null,
        day_open:'',
        day_out:'',
        round_sys:'',
        year_sys:'',
        status_sys:''
    }
}
function validate(){
    error.value = {}
    const f = form.value

    if(!f.day_open)error.value.day_open = 'กรุณากรอกวันที่เปิดรอบการประเมิน'
    if(!f.day_out)error.value.day_out = 'กรุณากรอกวันที่ปิดรอบการประเมิน'
    if(!f.round_sys)error.value.round_sys = 'กรุณากรอกรอบการประเมิน'
    if(!f.year_sys)error.value.year_sys = 'กรุณากรอกปีการประเมิน'
    if(!f.status_sys)error.value.status_sys = 'กรุณาเลือกสถานะการประเมิน'


    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_sys
        ? await axios.put(`${staff}/system/update/${f.id_sys}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/system/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
        alert("ดำเนินการสำเร็จ")
    } catch (error) {
        console.error("error save",error)
    }
}

const fetch = async()=>{
    try {
        const res2 = await axios.get(`${staff}/system/show`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res2.data

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

const del = async(id_sys:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/system/delete/${id_sys}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const search = ref('')
// const result = computed(()=>{
//     if(!search.value)return dataResult.value
//     const s = search.value.toLowerCase()
//     return dataResult.value.filter((items:any)=>{
//         return(
//             items.name_indicate.toLowerCase().includes(s)
//         )
//     })
// })

const formatDate = (dateStr:string)=>{
    const day = new Date(dateStr)
    return day.toLocaleDateString('th-TH')
}



onMounted(fetch)
</script>

<style scoped>

</style>