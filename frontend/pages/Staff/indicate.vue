ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <h3 class="font-weight-bold"><v-icon :icon="form.id_indicae ? 'mdi-pencil':'mdi-plus'"></v-icon>จัดการหัวข้อการประเมิน</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select label="หัวข้อการประเมิน" v-model="form.id_topic" :error-messages="error.id_topic" variant="outlined" :items="topics.map((t)=>({title:t.name_topic,value:t.id_topic}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="ชื่อตัวชี้วัด" v-model="form.name_indicate" :error-messages="error.name_indicate" variant="outlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-textarea label="รายละเอียดตัวชี้วัด" v-model="form.detail_indicate" :error-messages="error.detail_indicate" variant="outlined" rows="3"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :error-messages="error.point_indicate" variant="outlined" :items="[1,2,3,4,5]"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select label="ประเภทตัวเลือก" v-model="form.check_indicate" :error-messages="error.check_indicate" variant="outlined" :items="[{title:'มี',value:'y'},{title:'ไม่มี',value:'n'}]"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white" prepend-icon="mdi-content-save" type="submit" rounded="lg" color="primary">{{ form.id_indicate ? 'อัปเดต':'บันทึก' }}</v-btn>
                                            <v-btn class=" text-center text-white" prepend-icon="mdi-close" @click="reset()" rounded="lg" color="error" variant="tonal">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card rounded="xl" elevation="5">
                                <h3 class="font-weight-bold">ตัวชี้วัด</h3>
                                <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ms-3"></v-text-field>
                                <v-divide></v-divide>
                                <v-table class="mt-3" hover>
                                    <thead>
                                        <tr>
                                            <th class="text-center">ลำดับ</th>
                                            <th class="text-center">หัวข้อการประเมิน</th>
                                            <th class="text-center">ชื่อตัวชี้วัด</th>
                                            <th class="text-center">รายละเอียดตัวชี้วัด</th>
                                            <th class="text-center">น้ำหนักคะแนน</th>
                                            <th class="text-center">ประเภทตัวเลือก</th>
                                            <th class="text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(items,index) in result" :key="items.id_indicate">
                                            <td class="text-center">{{ index+1 }}</td>
                                            <td class="text-center">{{ items.name_topic }}</td>
                                            <td class="text-center">{{ items.name_indicate }}</td>
                                            <td class="text-center">{{ items.detail_indicate || '-' }}</td>
                                            <td class="text-center">{{ items.point_indicate }}</td>
                                            <td class="text-center">{{ items.check_indicate === 'y' ? 'มี (ตัวเลือกแบบ select)':'ไม่มี (ผู้ใช้ทำการกรอกข้อมูลเอง)' }}</td>
                                            <td class="text-center">
                                                <center>
                                                    <v-btn rounded="circle" icon="mdi-pencil" variant="tonal" color="warning" @click="edit(items)" class="ms-2"></v-btn>
                                                    <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" @click="del(items.id_indicate)" class="ms-2"></v-btn>
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
const topics = ref<any>([])
const form = ref({
    id_indicate:null,
    id_topic:'',
    name_indicate:'',
    detail_indicate:'',
    point_indicate:'',
    check_indicate:''
})
const reset = ()=>{
    form.value = {
        id_indicate:null,
        id_topic:'',
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:''
    }
}
function validate(){
    error.value = {}
    const f = form.value

    if(!f.id_topic)error.value.id_topic = 'กรุณาเลือกหัวข้อการประเมิน'
    if(!f.name_indicate.trim())error.value.name_indicate = 'กรุณากรอกชื่อตัวชี้วัด'
    if(!f.point_indicate)error.value.point_indicate = 'กรุณาเลือกน้ำหนักคะแนน'
    if(!f.check_indicate)error.value.check_indicate = 'กรุณาเลือกประเภทตัวเลือก'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_indicate
        ? await axios.put(`${staff}/indicate/update/${f.id_indicate}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/indicate/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
        alert("ดำเนินการสำเร็จ")
    } catch (error) {
        console.error("error save",error)
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/topic/show`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
        const res2 = await axios.get(`${staff}/indicate/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res2.data

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

const del = async(id_indicate:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/indicate/delete/${id_indicate}`,{headers:{Authorization:`Bearer ${token}`}})
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
            items.name_indicate.toLowerCase().includes(s)
        )
    })
})

onMounted(fetch)
</script>

<style scoped>

</style>