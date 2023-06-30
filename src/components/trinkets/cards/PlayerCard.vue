<script setup>
import LinkCard from "@/components/trinkets/cards/LinkCard.vue";

defineProps(['player']);
</script>

<template>
  <LinkCard to="Player" :id="player.playerId" :link-text="player.playerName" />
</template>

<style scoped>

</style>
