<template>

  <div id="wrapper">

    <div class="tabs is-toggle is-fullwidth">
      <ul>
        <li class="is-active">
          <a>Top</a>
        </li>
        <li>
          <router-link to="/container">Containers</router-link>
        </li>
        <li>
          <router-link to="/image">Images</router-link>
        </li>
      </ul>
    </div>

    <div class="content">
      <p>
        Seana - Simple GUI for Docker
      </p>
    </div>

    <div class="container">
      <command-information></command-information>
    </div>

    <div class="container">
      <search-panel></search-panel>
    </div>

  </div>

</template>

<script>
  import CommandInformation from './Docker/CommandInformation'
  import SearchPanel from './Docker/SearchPanel'

  export default {
    components: {
      CommandInformation,
      SearchPanel
    }
  }
</script>

<style scoped>
  p {
    text-align:center;
    font-style: italic;
    font-size:3vw;
  }
  .under {
    background: linear-gradient(transparent 70%, #A9F5F2 70%);
  }
</style>
