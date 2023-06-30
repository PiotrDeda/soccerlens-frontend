<script setup>
import MatchCard from "@/components/trinkets/cards/MatchCard.vue";
import PlayerCard from "@/components/trinkets/cards/PlayerCard.vue";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import TeamService from '@/services/team-service.js';
import UserService from "@/services/user-service";
import resolveError from "@/resolve-error";

const route = useRoute();
const router = useRouter();
/** @type {Ref<Team>} */
const team = ref([]);
/** @type {Ref<Player[]>} */
const players = ref([]);
/** @type {Ref<Match[]>} */
const matches = ref([]);
const loadingPlayers = ref(true);
const loadingMatches = ref(true);
const teamName = ref('');
const done = ref(false);
const deleteConfirm = ref(false);

async function updateTeam(event) {
  event.preventDefault();
  done.value = false;
  await TeamService.update({teamId: route.params.id, teamName: teamName.value})
      .then(async () => {
        await fetchTeam(route.params.id);
        done.value = true;
      })
      .catch(error => {
        alert(error)
        resolveError(error, router);
      })
}

async function deleteTeam() {
  await TeamService.delete(route.params.id)
      .then(() => {
        router.push({name: 'Teams'});
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchTeam(id) {
  await TeamService.get(id)
      .then(response => {
        team.value = response.data;
        teamName.value = team.value.teamName;
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchPlayers(id) {
  await TeamService.getPlayers(id)
      .then(response => {
        players.value = response.data;
        loadingPlayers.value = false;
      })
      .catch(error => {
        resolveError(error, router);
        loadingPlayers.value = false;
      })
}

async function fetchMatches(id) {
  await TeamService.getMatches(id)
      .then(response => {
        matches.value = response.data;
        loadingMatches.value = false;
      })
      .catch(error => {
        resolveError(error, router);
        loadingMatches.value = false;
      })
}

onMounted(async () => {
  const id = route.params.id;
  await fetchTeam(id);
  await fetchPlayers(id);
  await fetchMatches(id);
});

watch(() => route.params.id, async (id) => {
  await fetchTeam(id);
  await fetchPlayers(id);
  await fetchMatches(id);
});
</script>

<template>
  <div v-if="UserService.isAdmin()" class="badge">
    <form @submit="updateTeam">
      <label for="teamName">Team name: </label>
      <input v-model="teamName" type="text" id="teamName" required>
      <br>
      <button type="submit">Submit changes</button>
      <span v-if="done"> Done</span>
    </form>
    <button @click.prevent="deleteConfirm = true">Delete team</button>
    <div v-if="deleteConfirm">
      <button @click.prevent="deleteTeam">Confirm</button>
      <button @click.prevent="deleteConfirm = false">Cancel</button>
    </div>
  </div>
  <div v-else class="badge">{{ team.teamName }}</div>
  <div v-if="loadingPlayers || loadingMatches">Loading…</div>
  <div v-else class="tablelist">
    <h2>Players</h2>
    <div v-for="player in players" :key="player.playerName">
      <PlayerCard :player="player"/>
    </div>
    <h2>Matches</h2>
    <div v-for="match in matches" :key="match.matchId">
      <MatchCard :match="match"/>
    </div>
  </div>
</template>

<style scoped>

</style>
