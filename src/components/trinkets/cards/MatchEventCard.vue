<script setup>
import MatchEventService from "@/services/match-event-service";
import {ref} from "vue";
import {useRouter} from "vue-router";
import UserService from "@/services/user-service";
import resolveError from "@/resolve-error";

const router = useRouter();
const props = defineProps(['event']);
const emit = defineEmits(['refresh']);
const deletingMatchEvent = ref(false);

async function deleteMatchEvent() {
  await MatchEventService.delete(props.event.matchEventId)
      .then(() => {
        emit('refresh');
      })
      .catch(error => {
        resolveError(error, router);
      })
}
</script>

<template>
  <div class="badge">
    {{ event.minute }}'
    {{ MatchEventService.convertEventTypeName(event.eventType) }}
    <span v-if="event.player">
      <router-link :to="{name: 'Player', params: {id: event.player.playerId}}">
        <button>{{ event.player.playerName }}</button>
      </router-link>
    </span>
    <span v-if="event.secondPlayer">
      →
      <router-link :to="{name: 'Player', params: {id: event.secondPlayer.playerId}}">
        <button>{{ event.secondPlayer.playerName }}</button>
      </router-link>
    </span>
    <span>&nbsp;</span>
    <span v-if="deletingMatchEvent">
      <button @click.prevent="deleteMatchEvent">Confirm</button>
      <button @click.prevent="deletingMatchEvent = false">Cancel</button>
    </span>
    <button v-else-if="UserService.isAdmin()" @click.prevent="deletingMatchEvent = true">Delete</button>
  </div>
</template>

<style scoped>

</style>
