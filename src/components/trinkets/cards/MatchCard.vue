<script setup>
import LinkCard from "@/components/trinkets/cards/LinkCard.vue";

defineProps(['match']);

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
</script>

<template>
  <LinkCard to="Match" :id="match.matchId" :link-text=
      "`[${formatTime(match.startTime, match.endTime)}] ${match.homeTeam.teamName} vs. ${match.awayTeam.teamName}`"/>
</template>

<style scoped>

</style>
