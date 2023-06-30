<script setup>
import CommentCard from "@/components/trinkets/cards/CommentCard.vue";
import MatchEventCard from "@/components/trinkets/cards/MatchEventCard.vue";
import MatchEventSubmit from "@/components/trinkets/submits/MatchEventSubmit.vue";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import UserService from "@/services/user-service";
import MatchService from '@/services/match-service.js';
import CommentService from "@/services/comment-service";
import TeamService from "@/services/team-service";
import resolveError from "@/resolve-error";
import LinkCard from "@/components/trinkets/cards/LinkCard.vue";

const route = useRoute();
const router = useRouter();
/** @type {Ref<Match>} */
const match = ref([]);
/** @type {Ref<MatchEvent[]>} */
const matchEvents = ref([]);
/** @type {Ref<Comment[]>} */
const comments = ref([]);
const commentText = ref('');
/** @type {Ref<Team[]>} */
const teams = ref([]);
const startTime = ref('');
const endTime = ref('');
const homeTeamName = ref('');
const awayTeamName = ref('');
const done = ref(false);
const deleteConfirm = ref(false);
const loadingMatch = ref(true);

function formatTime(startTime, endTime) {
  const options = {hour: '2-digit', minute: '2-digit'};
  const start = new Date(startTime);
  let result = start.toLocaleDateString() + ' ' + start.toLocaleTimeString([], options)
  if (endTime !== null) {
    const end = new Date(endTime);
    result += ' - ' + end.toLocaleTimeString([], options);
  }
  return result;
}

function submitComment() {
  CommentService.create({matchId: match.value.matchId, commentText: commentText.value})
      .then(() => {
        commentText.value = '';
        fetchComments(route.params.id);
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function updateMatch(event) {
  event.preventDefault();
  done.value = false;
  let homeTeam = teams.value.find(team => team.teamName === homeTeamName.value);
  let awayTeam = teams.value.find(team => team.teamName === awayTeamName.value);
  await MatchService.update({
    matchId: match.value.matchId, startTime: startTime.value, endTime: endTime.value,
    homeTeam: homeTeam, awayTeam: awayTeam
  })
      .then(async () => {
        await fetchMatch(route.params.id);
        done.value = true;
      })
      .catch(error => {
        alert(error)
        resolveError(error, router);
      })
}

async function deleteMatch() {
  await MatchService.delete(route.params.id)
      .then(() => {
        router.push({name: 'Matches'});
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchMatch(id) {
  await MatchService.get(id)
      .then(response => {
        match.value = response.data;
        startTime.value = match.value.startTime;
        endTime.value = match.value.endTime;
        homeTeamName.value = match.value.homeTeam.teamName;
        awayTeamName.value = match.value.awayTeam.teamName;
        loadingMatch.value = false;
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchMatchEvents(id) {
  await MatchService.getEvents(id)
      .then(response => {
        matchEvents.value = response.data;
      })
      .catch(error => {
        resolveError(error, router);
      })
}

async function fetchComments(id) {
  await MatchService.getComments(id)
      .then(response => {
        comments.value = response.data;
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
  await fetchMatch(id);
  await fetchMatchEvents(id);
  await fetchComments(id);
  if (UserService.isAdmin()) {
    await fetchTeams();
  }
});

watch(() => route.params.id, async (id) => {
  await fetchMatch(id);
  await fetchMatchEvents(id);
  await fetchComments(id);
  if (UserService.isAdmin()) {
    await fetchTeams();
  }
});
</script>

<template>
  <div v-if="UserService.isAdmin()" class="badge">
    <form @submit="updateMatch">
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
      <button type="submit">Submit changes</button>
      <span v-if="done"> Done</span>
    </form>
    <button @click.prevent="deleteConfirm = true">Delete match</button>
    <div v-if="deleteConfirm">
      <button @click.prevent="deleteMatch">Confirm</button>
      <button @click.prevent="deleteConfirm = false">Cancel</button>
    </div>
  </div>
  <div v-else class="tablelist">
    <div v-if="match.startTime" class="badge">{{ formatTime(match.startTime, match.endTime) }}</div>
    <div v-if="match.homeTeam && match.awayTeam">
      <LinkCard to="Team" :id="match.homeTeam.teamId" :link-text="match.homeTeam.teamName"/>
      vs.
      <LinkCard to="Team" :id="match.awayTeam.teamId" :link-text="match.awayTeam.teamName"/>
    </div>
  </div>
  <hr/>
  <div v-for="event in matchEvents" :key="event.matchEventId">
    <MatchEventCard :event="event" @refresh="fetchMatchEvents(route.params.id)"/>
  </div>
  <hr/>
  <MatchEventSubmit v-if="!loadingMatch && UserService.isAdmin()" :matchId="match.matchId" @refresh="fetchMatchEvents(route.params.id)"/>
  <h2>Comments</h2>
  <div v-for="comment in comments" :key="comment.commentId">
    <CommentCard :comment="comment" @refresh="fetchComments(route.params.id)"/>
  </div>
  <div v-if="UserService.isLoggedIn()">
    <form @submit.prevent="submitComment">
      <input type="text" v-model="commentText">
      <button type="submit">Comment</button>
    </form>
  </div>
</template>

<style scoped>

</style>
