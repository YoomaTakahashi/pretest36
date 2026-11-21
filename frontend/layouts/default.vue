<template>
    <v-app>
        <v-app-bar flat :color="bg(user.role)" elevation="5" class="rounded-b">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-toolbar-title>
            <v-spacer></v-spacer>

            <p class="text-center">คุณ : {{ user.fname }} {{user.fname}}<br> {{ user.role }}</p>
            <v-btn varaint="text" @click="logout" icon="mdi-logout"></v-btn>
        </v-app-bar>    

        <v-navigation-drawer class="no-p" app color="#404040" v-model="drawer" width="260" :temporary="isMobile" :permanent="!isMobile">
            <v-list class="no-p" density="comfortable">
                <v-list-item class="no-p">
                    <v-list-item-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-list-item-title>
                    <div class="mt-3">
                        <v-chip color="white" class="no-p" variant="outlined">{{ user.role }}</v-chip>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider class="no-p" color="white" opacity="0.5"></v-divider>

            <v-list class="no-p" density="comfortable">
                <v-list-item class="no-p" v-for="[title,to] in navitem" :key="to" :to="to">
                    <v-list-item-title>
                        {{ title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class=py-2>
                <slot></slot>
            </v-container>
            <v-footer class="text-caption justify-center">©2026 NTC EVALUATION SYSTEM</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useDisplay } from 'vuetify';
import { api } from '~/API/base';

const user = ref<any>({})
const drawer = ref(false)
const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)


const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่')){
        return 
    }
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles: Record<string,[string,string][]> = {
    'ฝ่ายบุคลากร':[
        ['หน้าหลัก','/Staff/'],
        ['จัดการผู้รับการประเมิน','/Staff/Manage_eva'],
        ['จัดการกรรมการประเมิน','/Staff/Manage_commit'],
        ['จัดการหัวข้อการประเมิน','/Staff/Topic'],
        ['จัดการตัวชี้วัดการประเมิน','/Staff/Indicate'],
        ['จัดการรอบการประเมิน','/Staff/Round'],
        ['จัดการแบบประเมิน','/Staff/Eva'],
        ['ผลการประเมินของผู้รับการประเมิน','/Staff/Score_evaList'],
        ['ผลการประเมินของกรรมการประเมิน','/Staff/Score_commitList'],
        ['สถานะการประเมินของผู้รับการประเมิน','/Staff/Status_eva'],
        ['สถานะการประเมินของกรรมการประเมิน','/Staff/Status_commit'],
        ['เอกสารหรือคู่มือการประเมินผล','/Staff/Document'],
        ['รายงานผู้รับการประเมินผล','/Staff/Report'],
    ],

    'ผู้รับการประเมินผล':[
        ['หน้าหลัก','/Evaluatee/'],
        ['แก้ไขข้อมูลส่วนตัว','/Evaluatee/Edit_eva'],
        ['แบบประเมินตนเอง','/Evaluatee/Selfeva'],
        ['ตรวจสอบผลการประเมิน','/Evaluatee/Check_score'],
        ['รายงานผลการประเมิน','/Evaluatee/Report'],
        ['คู่มือการประเมินผล','/Evaluatee/Doc'],
    ],

    'กรรมการประเมิน':[
        ['รายชื่อผู้รับการประเมินผล','/Committee'],
        ['ดำเนินการประเมิน','/Committee/Show_eva'],
        ['ตรวจสอบผลและยืนยัน','/Committee/Check_comfirm'],
        ['คู่มือการประเมินผล','/Committee/Doc'],
    ]
}

const navitem = computed(() => roles[user.value.role] || [])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        return navigateTo('/',{replace:true})
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value =res.data
    } catch (error) {
        console.error('Error get',error)
    }
}

onMounted(fetch)

const bg = (role:string) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007fff'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}
</script>

<style scoped>
@media print {
    .v-app-bar,.v-btn,.no-p{
        display: none !important;
        margin-top: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 0px !important;
    }
}
</style>