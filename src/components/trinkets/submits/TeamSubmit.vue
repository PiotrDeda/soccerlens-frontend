<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import TeamService from "@/services/team-service";
import resolveError from "@/resolve-error";

const emit = defineEmits(['refresh']);
const router = useRouter();
const teamName = ref('');

async function submitTeam(event) {
  event.preventDefault();
  await TeamService.create({teamName: teamName.value})
      .then(() => {
        emit('refresh');
      })
      .catch(error => {
        resolveError(error, router);
      })
}
</script>

<template>
  <form @submit="submitTeam" class="badge">
    <label for="teamName">Team name: </label>
    <input v-model="teamName" type="text" id="teamName" required>
    <br>
    <button type="submit">Add team</button>
  </form>
</template>

<style scoped>

</style>
