<template>
    <v-container>
        <PageHeader title="แบบประเมินตนเอง" subtitle="ใส่คะแนนประเมิน 1-4 และ สามารถแนบไฟล์ PNG PDF และ JPG" icon="mdi-clipboard-edit"></PageHeader>

        <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
            <v-card rounded="xl" class="mb-6" elevation="4">
                <v-list-item prepend-icon="mdi-account-circle" :title="`${user.fname}-${user.lname}`" :subtitle="`รอบการประเมิน : ${user.round_sys} /ปี ${user.year_sys}`" ></v-list-item>
            </v-card>

            <v-card v-for="(topic,t) in topics" :key="topic.id_topic">
                <v-card-title class="pa-4 bg-grey">{{ Number(t)+1 }}.{{ topic.name_topic }}</v-card-title>
                <v-card-text v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                    <div class="text-title-medium font-weigth-bold">{{ Number(t)+1 }}.{{ Number(i)+1 }} : {{ indicate.name_indicate }}</div>
                    <div class="text-medium-emphasis mb-2">{{ indicate.detail_indicate }}</div>
                    <v-chip size="small" class="me-2 mb-4">น้ำหนักคะแนน : {{ indicate.point_indicate }}</v-chip>
                    <v-chip size="small" class=" mb-4" color="info">คะแนนเต็ม : {{ indicate.point_indicate*4 }}</v-chip>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนน 1-4 " v-model="indicate.score" variant="outlined" :items="[1,2,3,4]" ></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>