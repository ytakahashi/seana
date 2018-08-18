<template>

  <div id="wrapper">

    <div class="columns">
      <div class="column is-6 is-offset-3">
        <img id="logo" src="~@/assets/logo_transparent.png" alt="docker-gui">
      </div>
    </div>

    <div class="container">
  
      <div class="column is-half is-offset-one-quarter">
        <router-link to="/container" class="button is-primary is-outlined">Container</router-link>
        <router-link to="/image" class="button is-primary is-outlined">Image</router-link>
      </div>

      <command-information></command-information>

    </div>

  </div>

</template>

<script>
  import CommandInformation from './Docker/CommandInformation'

  export default {
    components: {
      CommandInformation
    }
  }
</script>
