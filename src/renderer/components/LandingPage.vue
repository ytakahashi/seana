<template>

  <div id="wrapper">

    <div class="tabs is-toggle is-fullwidth">
      <ul>
        <li class="is-active"><a>Top</a></li>
        <li>
          <router-link to="/container">Containers</router-link>
        </li>
        <li>
          <router-link to="/image">Images</router-link>
        </li>
      </ul>
    </div>

    <div class="container">
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
