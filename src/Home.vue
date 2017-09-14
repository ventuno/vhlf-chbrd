<template>
  <div id="home">
      Home
      <ul>
          <li><input v-model="gameId" placeholder="Join existing game"> <router-link v-if="gameId" :to="{path: 'board', query: {gameId: gameId}}">Join game</router-link></li>
          <li><router-link :to="{path: 'board', query: {role: 'w'}}">New game as White</router-link></li>
          <li><router-link :to="{path: 'board', query: {role: 'b'}}">New game as Black</router-link></li>
      </ul>
  </div>
</template>

<script>
export default {
    name: 'home',
    data () {
        return {
            gameId: undefined
        }
    }
}
</script>

<style lang="scss">
</style>
