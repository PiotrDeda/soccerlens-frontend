<script setup>
import MatchCard from "@/components/trinkets/cards/MatchCard.vue";
import MatchSubmit from "@/components/trinkets/submits/MatchSubmit.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import MatchService from '@/services/match-service.js';
import resolveError from "@/resolve-error";
import UserService from "@/services/user-service";

const router = useRouter();
/** @type {Ref<Match[]>} */
const matches = ref([]);
const loading = ref(true);

async function fetchMatches() {
  await MatchService.getAll()
      .then(response => {
        matches.value = response.data;
        loading.value = false;
      })
      .catch(error => {
        resolveError(error, router);
        loading.value = false;
      })
}

onMounted(async () => {
  await fetchMatches();
})
</script>

<template>
  <div>
    <div v-if="loading">Loading…</div>
    <div v-else v-for="match in matches" :key="match.matchId" class="tablelist">
      <MatchCard :match="match"/>
    </div>
    <hr/>
    <MatchSubmit v-if="UserService.isAdmin()" @refresh="fetchMatches"/>
  </div>
</template>

<style scoped>

</style>
