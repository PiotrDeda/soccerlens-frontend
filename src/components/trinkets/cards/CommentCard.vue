<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import UserService from "@/services/user-service";
import CommentService from "@/services/comment-service";
import resolveError from "@/resolve-error";

const router = useRouter();
defineProps(['comment']);
const emit = defineEmits(['refresh']);
const deletingComment = ref(false);

function formatTime(timestamp) {
  const options = {hour: '2-digit', minute: '2-digit', second: '2-digit'};
  const time = new Date(timestamp);
  return time.toLocaleTimeString([], options);
}

function deleteComment(id) {
  CommentService.delete(id)
      .then(() => {
        emit('refresh');
      })
      .catch(error => {
        resolveError(error, router);
      })
}
</script>

<template>
  <div class="comment badge">
    <div class="badge">
      <span v-if="comment.user.role === 'ROLE_ADMIN'">ADMIN</span>
      {{ comment.user.username }} @ {{ formatTime(comment.timestamp) }}
    </div>
    <div class="comment-text">{{ comment.commentText }}</div>
    <span v-if="deletingComment">
      <button @click.prevent="deleteComment(comment.commentId)">Confirm</button>
      <button @click.prevent="deletingComment = false">Cancel</button>
    </span>
    <button v-else-if="UserService.isAdmin() || UserService.isCurrentUserId(comment.user.userId)"
            @click.prevent="deletingComment = true">Delete</button>
  </div>
</template>

<style scoped>
.comment {
  display: flex;
  align-items: center;
}

.comment-text {
  margin: 5px;
}
</style>
