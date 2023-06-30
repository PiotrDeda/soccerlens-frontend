<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import MatchService from "@/services/match-service";
import MatchEventService from "@/services/match-event-service";
import resolveError from "@/resolve-error";
import TeamService from "@/services/team-service";

const props = defineProps(['matchId']);
const emit = defineEmits(['refresh']);
const router = useRouter();
/** @type {Ref<Match>} */
const match = ref({});
/** @type {Ref<Player[]>} */
const players = ref([]);
/** @type {Ref<Player>} */
const playerId = ref('');
/** @type {Ref<Player>} */
const secondPlayerId = ref();
const eventType = ref('');
const minute = ref('');

async function submitMatchEvent(event) {
  event.preventDefault();
  let player = players.value.find(player => player.playerId === playerId.value);
  let secondPlayer = secondPlayerId.value ? players.value.find(player => player.playerId === secondPlayerId.value) : null;
  await MatchEventService.create({
    match: match.value, player: player, secondPlayer: secondPlayer,
    eventType: eventType.value, minute: minute.value
  })
      .then(() => {
        emit('refresh');
      })
      .catch(error => {
        resolveError(error, router);
      });
}

async function fetchPlayers() {
  await MatchService.get(props.matchId)
      .then(async response => {
        match.value = response.data;
        await TeamService.getPlayers(match.value.homeTeam.teamId)
            .then(async response => {
              players.value = response.data;
              await TeamService.getPlayers(match.value.awayTeam.teamId)
                  .then(response => {
                    players.value = players.value.concat(response.data);
                  })
                  .catch(error => {
                    resolveError(error, router);
                  })
            })
            .catch(error => {
              resolveError(error, router);
            })
      })
      .catch(error => {
        resolveError(error, router);
      });
}

onMounted(async () => {
  await fetchPlayers();
});
</script>

<template>
  <div>
    <form @submit="submitMatchEvent" class="badge">
      <label for="eventType">Event type: </label>
      <select v-model="eventType" required>
        <option v-for="event in MatchEventService.eventTypes()" :value="event.value">
          {{ event.label }}
        </option>
      </select>
      <br>
      <label for="playerId">Player: </label>
      <select id="playerId" v-model="playerId" required>
        <option v-for="player in players" :value="player.playerId">{{ player.playerName }}
        </option>
      </select>
      <br>
      <span v-if="eventType === 'SUBSTITUTION'">
        <label for="secondPlayerId">Substituting player: </label>
        <select id="secondPlayerId" v-model="secondPlayerId" required>
          <option v-for="player in players" :value="player.playerId">{{ player.playerName }}
          </option>
        </select>
        <br>
      </span>
      <label for="minute">Minute: </label>
      <input type="number" id="minute" v-model="minute" min="0" required>
      <br>
      <button type="submit">Add match event</button>
    </form>
  </div>
</template>

<style scoped>

</style>
