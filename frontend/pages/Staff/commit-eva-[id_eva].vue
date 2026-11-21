ts<template>
    <v-app>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <page-header class="mb-4" title="เพิ่มกรรมการประเมิน" icon="mdi-account-group" subtitle="เพิ่มกรรมการทั้ง 3 คน"></page-header>
                    <v-card class="mb-4" rounded="xl" elevation="12">
                        <v-list bg-color="transparent" density="compact">
                            <v-list-item :title="`ผู้รับการประเมิน: ${header.fname} ${header.lname}`" :subtitle="`รอบการประเมิน: ${header.round_sys} ปี:${header.year_sys}`" class="pa-4"></v-list-item>
                        </v-list>
                    </v-card>
                    <v-card rounded="xl" elevation="12">
                        <v-card-title>
                            <h3 class="font-weight-bold"><v-icon icon="mdi-account"></v-icon>เพิ่มกรรมการ</h3>
                        </v-card-title>
                        <v-card-text>
                            <br>
                            <v-form @submit.prevent="saveMember">
                                <v-row v-for="(c,index) in List" :key="index">
                                    <v-col cols="12" md="6">
                                        <v-select :label="`กรรมการประเมินคนที่: ${index+1}`" v-model="c.id_member" variant="outlined" :items="MEMBER(index).map((t)=>({title:`${t.fullname_commit}`,value:t.id_member}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select :label="`ตำแหน่งกรรมการประเมินคนที่: ${index+1}`" v-model="c.role" variant="outlined" :items="ROLE(index)"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <center>
                                            <v-btn class=" text-center text-white ma-2" prepend-icon="mdi-content-save" type="submit" color="primary">บันทึก</v-btn>
                                            <v-btn class=" text-center text-grey" prepend-icon="mdi-arrow-left" rounded="lg" to="/Staff/eva" color="grey" variant="outlined">ย้อนกลับ</v-btn>
                                        </center>
                                    </v-col>
                                </v-row>
                            </v-form>
                            
                            
                        </v-card-text>
                    </v-card>
                    <v-card rounded="xl" elevation="5" class="mt-4">
                        <h3 class="font-weight-bold"><v-icon icon="mdi-account-group" class="ms-2"></v-icon>กรรมการประเมิน</h3>
                        <v-divide></v-divide>
                        <v-table class="mt-3" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">ลำดับ</th>
                                    <th class="text-center">กรรมการประเมิน</th>
                                    <th class="text-center">ตำแหน่ง</th>
                                    <th class="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :key="items.id_commit">
                                    <td class="text-center">{{ index+1 }}</td>
                                    <td class="text-center">{{ nameOf(items.id_member) }}</td>
                                    <td class="text-center">{{ items.role }}</td>
                                    <td class="text-center">
                                        <center>
                                            <v-btn rounded="circle" icon="mdi-delete" variant="tonal" color="error" size="small" @click="del(items.id_commit)" class="ms-2"></v-btn>
                                        </center>
                                    </td>
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
const people = ref([])
const header = ref<any>([])
const role = ['ประธาน','กรรมการ','เลขา']

const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''}
])

const token = import.meta.client ? localStorage.getItem('token'):null
const id_eva = useRoute().params.id_eva

const saveMember = async()=>{
    try {
        await axios.post(`${staff}/commit/save/${id_eva}`,List.value,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        alert("ดำเนินการสำเร็จ")
    } catch (error) {
        console.error("error save",error)
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res.data
        const res2 = await axios.get(`${staff}/commit/member/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        people.value = res2.data.pick
        const useData = res2.data.picked
        if(useData.length === 0){
            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''}
            ]
        }else{
            List.value = useData.map((c)=>(
                {id_commit:c.id_commit,id_member:c.id_member,role:c.role}
            ))

            while(List.value.length < 3){
                List.value.push({id_commit:null,id_member:'',role:''})
            }
        }
    } catch (error) {
        console.error("Error get",error);
        
    }
}

const del = async(id_commit:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/commit/delete/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const nameMap =  computed(()=> Object.fromEntries(people.value.map((p)=>[p.id_member,p.fullname_commit])))
const nameOf = (id:number)=> nameMap.value[id]

const MEMBER = (idx:number)=>{
    const picked = List.value.map((c,i)=>(i !== idx ? c.id_member : null))
    return people.value.filter((p)=> !picked.includes(p.id_member))
}

const ROLE = (idx:number)=>{
    const picked = List.value.map((c,i)=>(i !== idx ? c.role : null))
    return role.filter((p)=> !picked.includes(p))
}

onMounted(fetch)
</script>

<style scoped>

</style>