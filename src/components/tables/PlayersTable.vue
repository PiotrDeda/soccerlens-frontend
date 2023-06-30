<script setup>
import PlayerCard from "@/components/trinkets/cards/PlayerCard.vue";
import PlayerSubmit from "@/components/trinkets/submits/PlayerSubmit.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import PlayerService from '@/services/player-service.js';
import UserService from "@/services/user-service";
import resolveError from "@/resolve-error";

const router = useRouter();
/** @type {Ref<Player[]>} */
const players = ref([]);
const loading = ref(true);

async function fetchPlayers() {
  await PlayerService.getAll()
      .then(response => {
        players.value = response.data;
        loading.value = false;
      })
      .catch(error => {
        resolveError(error, router);
        loading.value = false;
      })
}

onMounted(async () => {
  await fetchPlayers();
})
</script>

<template>
  <div>
    <div v-if="loading">Loading…</div>
    <div v-else v-for="player in players" :key="player.playerId" class="tablelist">
      <PlayerCard :player="player"/>
    </div>
    <hr/>
    <PlayerSubmit v-if="UserService.isAdmin()" @refresh="fetchPlayers"/>
  </div>
</template>

<style scoped>

</style>
