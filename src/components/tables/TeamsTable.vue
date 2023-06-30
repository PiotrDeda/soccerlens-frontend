<script setup>
import TeamCard from "@/components/trinkets/cards/TeamCard.vue";
import TeamSubmit from "@/components/trinkets/submits/TeamSubmit.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import TeamService from '@/services/team-service.js';
import resolveError from "@/resolve-error";
import UserService from "@/services/user-service";

const router = useRouter();
/** @type {Ref<Team[]>} */
const teams = ref([]);
const loading = ref(true);

async function fetchTeams() {
  await TeamService.getAll()
      .then(response => {
        teams.value = response.data;
        loading.value = false;
      })
      .catch(error => {
        resolveError(error, router);
        loading.value = false;
      })
}

onMounted(async () => {
  await fetchTeams();
})
</script>

<template>
  <div>
    <div v-if="loading">Loading…</div>
    <div v-else v-for="team in teams" :key="team.teamId" class="tablelist">
      <TeamCard :team="team"/>
    </div>
    <hr/>
    <TeamSubmit v-if="UserService.isAdmin()" @refresh="fetchTeams"/>
  </div>
</template>

<style scoped>

</style>
