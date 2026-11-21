ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header class="mb-4" title="จัดการหัวข้อการประเมิน" icon="mdi-account-star" subtitle="เพิ่ม ลบ แก้ไข ข้อมูลของหัวข้อการประเมิน"></page-header>
                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <h3 class="font-weight-bold"><v-icon :icon="form.id_topic ? 'mdi-pencil':'mdi-plus'"></v-icon>จัดการหัวข้อการประเมิน</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="ชื่อหัวข้อการประเมิน" v-model="form.name_topic" :error-messages="error.name_topic" variant="outlined"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-content-save" type="submit" color="primary">{{ form.id_topic ? 'อัปเดต':'บันทึก' }}</v-btn>
                                            <v-btn class=" text-center text-white" prepend-icon="mdi-close" @click="reset()"  color="error" variant="tonal">ยกเลิก</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card rounded="xl" elevation="5">
                                <h3 class="font-weight-bold">หัวข้อการประเมิน</h3>
                                <v-text-field label="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify" variant="outlined" class="ma-3"></v-text-field>
                                <v-divide></v-divide>
                                <v-table class="mt-3" hover>
                                    <thead>
                                        <tr>
                                            <th class="text-center">ลำดับ</th>
                                            <th class="text-center">ชื่อหัวข้อการประเมิน</th>
                                            <th class="text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(items,index) in result" :key="items.id_topic">
                                            <td class="text-center">{{ index+1 }}</td>
                                            <td class="text-center">{{ items.name_topic }}</td>
                                            <td class="text-center">
                                                <center>
                                                    <v-btn rounded="circle" icon="mdi-pencil" variant="tonal" color="warning" @click="edit(items)" class="ms-2"></v-btn>
                                                    <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" @click="del(items.id_topic)" class="ms-2"></v-btn>
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
const form = ref({
    id_topic:null,
    name_topic:''
})
const reset = ()=>{
    form.value = {
        id_topic:null,
        name_topic:''
    }
}
function validate(){
    error.value = {}
    const f = form.value

    if(!f.name_topic.trim())error.value.name_topic = 'กรุณากรอกชื่อหัวข้อการประเมิน'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null

const saveMember = async()=>{
    if(!validate())return 
    const f = form.value
    try {
        f.id_topic
        ? await axios.put(`${staff}/topic/update/${f.id_topic}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/topic/save`,f,{headers:{Authorization:`Bearer ${token}`}})
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
        dataResult.value = res.data

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

const del = async(id_topic:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/topic/delete/${id_topic}`,{headers:{Authorization:`Bearer ${token}`}})
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