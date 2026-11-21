<template>
    <v-container>
        <page-header title="รายงานการประเมิน" subtitle="รายงานผลเกี่ยวกับการประเมิน"></page-header>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="ma-2 pa-4" rounded="xl" v-for="r in report" :key="r.title" :to="r.link">
                    <div class=" d-flex align-center">
                        <v-avatar size="64" color="#647687" :icon="r.icon" ></v-avatar>
                        <div class="mx-5">
                            <h3 class="text-weight-bold my-0">{{ r.title }}</h3>
                            <h3 class="text-body-medium text-medium-emphasis my-0">{{ r.detail }}</h3>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue';

const report = [
    {title:'รายงานผลผู้รับการประเมิน',detail:'ออกเอกสารผู้รับการประเมินผล',icon:'mdi-account-school',link:'/Staff/re_eva'}
]


</script>

<style scoped>

</style>