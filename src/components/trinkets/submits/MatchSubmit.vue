<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import MatchService from "@/services/match-service";
import TeamService from "@/services/team-service";
import resolveError from "@/resolve-error";

const emit = defineEmits(['refresh']);
const router = useRouter();
const startTime = ref('');
const endTime = ref('');
/** @type {Ref<Team[]>} */
const teams = ref([]);
const homeTeamName = ref('');
const awayTeamName = ref('');

async function submitMatch(event) {
  event.preventDefault();
  let homeTeam = teams.value.find(team => team.teamName === homeTeamName.value);
  let awayTeam = teams.value.find(team => team.teamName === awayTeamName.value);
  await MatchService.create({
    startTime: startTime.value, endTime: endTime.value,
    homeTeam: homeTeam, awayTeam: awayTeam
  })
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
  <form @submit="submitMatch" class="badge">
    <label for="startTime">Start time: </label>
    <input v-model="startTime" type="datetime-local" id="startTime" required>
    <br>
    <label for="startTime">End time: </label>
    <input v-model="endTime" type="datetime-local" id="endTime">
    <br>
    <label for="team">Home team: </label>
    <select v-model="homeTeamName">
      <option v-for="team in teams" :value="team.teamName">{{ team.teamName }}</option>
    </select>
    <br>
    <label for="team">Away team: </label>
    <select v-model="awayTeamName">
      <option v-for="team in teams" :value="team.teamName">{{ team.teamName }}</option>
    </select>
    <br>
    <button type="submit">Add match</button>
  </form>
</template>

<style scoped>

</style>
