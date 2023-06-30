<script setup>
import LinkCard from "@/components/trinkets/cards/LinkCard.vue";

defineProps(['team']);
</script>

<template>
  <LinkCard to="Team" :id="team.teamId" :link-text="team.teamName" />
</template>

<style scoped>

</style>
