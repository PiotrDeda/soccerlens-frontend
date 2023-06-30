<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import PlayerService from '@/services/player-service.js';
import resolveError from "@/resolve-error";
import UserService from "@/services/user-service";
import TeamService from "@/services/team-service";

const route = useRoute();
const router = useRouter();
/** @type {Ref<Player>} */
const player = ref([]);
/** @type {Ref<Team[]>} */
const teams = ref([]);
const playerName = ref('');
const teamName = ref('');
const done = ref(false);
const deleteConfirm = ref(false);

async function updatePlayer(event) {
  event.preventDefault();
  done.value = false;
  let team = teams.value.find(team => team.teamName === teamName.value);
  await PlayerService.update({playerId: route.params.id, playerName: playerName.value, team: team})
      .then(async () => {
        await fetchPlayer(route.params.id);
        done.value = true;
      })
      .catch(error => {
        alert(error)
        resolveError(error, router);
      })
}

async function deletePlayer() {
  await PlayerService.delete(route.params.id)
      .then(() => {
        router.push({name: 'Players'});
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchPlayer(id) {
  await PlayerService.get(id)
      .then(response => {
        player.value = response.data;
        playerName.value = player.value.playerName;
        teamName.value = player.value.team.teamName;
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchTeams() {
  await TeamService.getAll()
      .then(response => {
        teams.value = response.data;
      })
      .catch(error => {
        resolveError(error, router);
      })
}

onMounted(async () => {
  const id = route.params.id;
  await fetchPlayer(id);
  if (UserService.isAdmin()) {
    await fetchTeams();
  }
});

watch(() => route.params.id, async (id) => {
  await fetchPlayer(id);
  if (UserService.isAdmin()) {
    await fetchTeams();
  }
});
</script>

<template>
  <div v-if="UserService.isAdmin()" class="badge">
    <form @submit="updatePlayer">
      <label for="teamName">Player name: </label>
      <input v-model="playerName" type="text" id="teamName" required>
      <br>
      <label for="team">Team: </label>
      <select v-model="teamName" required>
        <option v-for="team in teams" :value="team.teamName">{{ team.teamName }}</option>
      </select>
      <br>
      <button type="submit">Submit changes</button>
      <span v-if="done"> Done</span>
    </form>
    <button @click.prevent="deleteConfirm = true">Delete player</button>
    <div v-if="deleteConfirm">
      <button @click.prevent="deletePlayer">Confirm</button>
      <button @click.prevent="deleteConfirm = false">Cancel</button>
    </div>
  </div>
  <div v-else>
    <div class="badge">{{ player.playerName }}</div>
  </div>
  <div v-if="!UserService.isAdmin()">
    Team:
    <router-link v-if="player.team" :to="{ name: 'Team', params: { id: player.team.teamId } }">
      <button>{{ player.team.teamName }}</button>
    </router-link>
  </div>
</template>

<style scoped>

</style>
