<template>
    <v-app class="bg-style">
        <v-container>
            <v-row align="center" justify="center">
                <v-col cols="12" md="6">
                    <div>
                        <div class="logo-box mb-6 mx-auto mx-md-0">
                            <div class="logo-ring"></div>
                            <v-sheet width="150" height="150" elevation="3" rounded="circle" class="d-flex align-center justify-center float-logo">
                                <v-img width="200" height="200" src="/img/logo.png"></v-img>
                            </v-sheet>
                        </div>
                        <div class="text-display-medium font-weight-bold mb-1">
                            <span class="text-blue-darken-5">วิทยาลัยเทคนิค<span class="text-red-lighten-2">น่าน</span></span>
                        </div>
                        <div class="text-title-medium text-medium-emphasis font-weight-bold mb-4">
                            <h3>
                                NTC Evaluation System - ระบบประเมินบุคลากร
                            </h3>
                        </div>

                        <ClientOnly>
                            <v-chip size="large" variant="elevated" color="white" class="mb-6">
                                <v-icon color="success" size="10" class="blink mx-2" icon="mdi-circle"></v-icon>
                                <h3 class="text-title-large font-weight-bold">{{ time }}</h3>
                                <h3 class="text-body-medium font-weight-bold text-medium-emphasis mx-2">{{ date }}</h3>
                            </v-chip>
                        </ClientOnly>

                        <v-card rounded="xl" variant="outlined" elevation="3" class="pa-4 bg-white d-none d-md-block">
                            <div class="text-title-large text-black font-weight-bold">การเข้าใช้งานระบบ</div>
                            <v-list bg-color="transparent">
                                <v-list-item v-for="r in typeMember" :key="r.title" :title="r.title" :subtitle="r.detail" :prepend-icon="r.icon" class="px-0 text-black"></v-list-item>
                            </v-list>
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="12" md="5" sm="8" offset-md="1">
                    <v-card rounded="xl" elevation="3" class="pa-4">

                        <v-chip size="small" prepend-icon="mdi-clock-outline" color="primary" variant="tonal">{{ greeting }}</v-chip>
                        <div class="mb-3 d-flex text-title-large align-center">
                            <v-img src="/img/logo.png" max-width="36" height="36"></v-img>
                            <h3>เข้าสู่ระบบ</h3>
                        </div>
                        <v-alert density="compact" type="error" class="my-3 shake" v-if="error" variant="tonal">{{ error }}</v-alert>
                        <v-form @submit.prevent="login">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="username"  variant="outlined" prepend-inner-icon="mdi-account-circle"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field label="รหัสผ่าน" v-model="password"  variant="outlined" prepend-inner-icon="mdi-lock" :append-inner-icon="show ? 'mei-eye':'mdi-eye-off'" :type="show ? 'text':'password'" @click:append-inner="show = !show"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select label="ประเภทสมาชิก" v-model="role"  variant="outlined" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-checkbox label="จดจำฉัน" v-model="remember"  variant="outlined" density="compact" hide-details></v-checkbox>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-white text-center font-weight-bold text-title-large red-btn w-100 my-4 py-7" rounded="lg" append-icon="mdi-arrow-right" type="submit">เข้าสู่ระบบ</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <p class="text-center text-body-large text-medium-emphasis">หากไม่มีบัญชี <nuxt-link to="/regis" class="text-red-lighten-3">สมัครสมาชิก</nuxt-link></p>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import auth from '~/API/auth'
import { api } from '~/API/base'

definePageMeta({
    layout:false
})
const pic_user = ref<File | null>(null)
const error = ref('')
const show = ref(false)
const remember = ref(false)
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const username = ref('')
const password = ref('')
const role = ref('')

const typeMember = [
    {title:'ฝ่ายบุคลากร',detail:'จัดการการประเมิน เช่น หัวข้อ ตัวชี้วัด สมาชิก และแบบประเมิน',icon:'mdi-account-tie'},
    {title:'ผู้รับการประเมินผล',detail:'แก้ไขข้อมูลส่วนตัว ประเมินตนเอง แนบหลักฐาน และพิมพ์เอกสาร',icon:'mdi-account-school'},
    {title:'กรรมการประเมิน',detail:'ประเมินผู้รับการประเมิน และ แนบรายเซ็น',icon:'mdi-account-star'},
]

let timer:any
const now = ref(new Date())

onMounted(()=>{
    timer = setInterval(()=>(now.value = new Date()),1000)

    const saved = localStorage.getItem('saveUser')
    if(saved){
        username.value = saved
        remember.value = true
    }
})

onUnmounted(()=> clearInterval(timer))

const time = computed(()=> now.value.toLocaleTimeString('th-TH'))
const date = computed(()=> now.value.toLocaleTimeString('th-TH',{weekday:'narrow',day:'numeric',month:'narrow',year:'numeric'}))

const greeting = computed(()=>{
    const h = now.value.getHours()
    if(h < 12)return 'สวัสดีตอนเช้า'
    if(h < 17)return 'สวัสดีตอนบ่าย'
    if(h < 24)return 'สวัสดีตอนค่ำ'
    return 'ยินดีต้อนรับ'
})

const login = async()=>{
    try {
        const res = await auth.login({
            username:username.value,
            password:password.value,
            role:role.value
        })
        localStorage.setItem('token',res.data.token)

        if(remember.value)localStorage.setItem('saveUser',username.value)
        else localStorage.removeItem('saveUser')

        if(res.data.changePw)localStorage.setItem('changePw','n')
        else localStorage.removeItem('changePw')
        alert('ดำเนินการสำเร็จ')
        if (res.data.changePw) return navigateTo('/Evaluatee/changePw')
        const useRole = res.data.role
        if(useRole === 'ฝ่ายบุคลากร')useRouter().push('/Staff')
        if(useRole === 'ผู้รับการประเมินผล')useRouter().push('/Evaluatee')
        if(useRole === 'กรรมการประเมิน')useRouter().push('/Committee')
        
    } catch (err:any) {
        console.error("Error login",err);
        error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
        
    }
}


</script>

<style scoped>

.bg-style{
    background: linear-gradient(135deg,white 0%,rgb(255, 223, 223) 30%,rgb(226, 242, 255) 80%);
}

.red-btn{
    background: linear-gradient(135deg,rgb(255, 54, 54),rgb(255, 76, 106));
    transition: all 0.5s ease-in-out linear;
}

.red-btn:hover{
    transform: translateY(-3px);
    box-shadow: 0px 3px 10px 3px rgba(255, 129, 129, 0.483);
}

.logo-box{
    position: relative;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 200px;
    height: 200px;
}

.logo-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #1e88e5;
    border-bottom-color: #e53950;
    animation: spin 4s linear infinite;
}

.logo-float {
    animation: float 3s ease-in-out infinite;
}


.blink {
    animation: blink 1s infinite;
}




.shake {
    animation: shake 0.4s ease-out;
}


@keyframes spin {
    to { transform: rotate(360deg); }
}
@keyframes float {
    50% { transform: translateY(-8px); }
}
@keyframes blink {
    50% { opacity: 0.2; }
}
@keyframes shake {
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
}


</style>