<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import PlayerService from "@/services/player-service";
import TeamService from "@/services/team-service";
import resolveError from "@/resolve-error";

const emit = defineEmits(['refresh']);
const router = useRouter();
const playerName = ref('');
/** @type {Ref<Team[]>} */
const teams = ref([]);
const teamName = ref('');

async function submitPlayer(event) {
  event.preventDefault();
  let team = teams.value.find(team => team.teamName === teamName.value);
  await PlayerService.create({playerName: playerName.value, team: team})
      .then(() => {
        emit('refresh');
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
  await fetchTeams();
});
</script>

<template>
  <form @submit="submitPlayer" class="badge">
    <label for="playerName">Player name: </label>
    <input v-model="playerName" type="text" id="playerName" required>
    <br>
    <label for="team">Team: </label>
    <select v-model="teamName" required>
      <option v-for="team in teams" :value="team.teamName">{{ team.teamName }}</option>
    </select>
    <br>
    <button type="submit">Add player</button>
  </form>
</template>

<style scoped>

</style>
