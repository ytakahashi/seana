<template>
  <div class="box">

    <div class="content">

      <p class="box-list-title">{{ repository }}:{{ tag }} <span>(ID: {{ imageId }})</span></p>

      <div class="content">
        <ul class="box-list-text">
          <li>created: {{ created }}</li>
          <li>size: {{ size }}</li>
        </ul>
      </div>

    </div>

    <div class="content">
      <a class="button is-link is-outlined" @click="runContainer">Run a container</a>
      <a class="button is-danger is-outlined" @click="deleteImage">Delete This Image</a>
    </div>

    <div class="content">
      <div class="field has-addons" v-show="showRunContainer">
        <p class="control">
          <a class="button is-static">
            docker run
          </a>
        </p>
        <div class="control">
          <input v-model="input" class="input" type="text" placeholder="input options">
        </div>
        <p class="control">
          <a class="button is-static">
            {{ repository }}:{{ tag }}
          </a>
        </p>
        <div class="control">
          <a class="button is-info" @click="execRunContainer(repository, tag, input)">
            Run
          </a>
        </div>
      </div>
    </div>

    <div class="content">

      <div class="field has-addons">

        <div class="field has-addons" v-if="commandSucceeded">

          <div class="command-succeed-msg-box">
              <p>following command has been run:</p>
              <code>
              $ {{ executedCommand }}
              </code>
          </div>

        </div>

      </div>

      <div class="command-err-msg-box" v-if="commandError">
        <span class="box-title">Command Failed</span>
        <pre>{{ commandError }}</pre>
      </div>

    </div>

    <loading :active.sync="isLoading"></loading>
  </div>

</template>

<script>
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/vue-loading.css'

  const { exec } = window.require('child_process')

  export default {
    methods: {
      runCommand (cmd) {
        exec(cmd, (error, stdout, stderr) => { // eslint-disable-line no-unused-vars
          if (error) {
            this.commandError = String(error)
            this.commandSucceeded = false
            this.isLoading = false
            return
          }
          this.commandSucceeded = true
          this.commandError = null
          this.isLoading = false
        })
      },
      runContainer () {
        this.showRunContainer = true
      },
      startLoading () {
        this.isLoading = true
        return {}
      },
      execRunContainer (repository, tag, option) {
        this.isLoading = true
        const command = `docker run ${option === null ? '' : option} ${repository}:${tag}`
        this.runCommand(command)
        this.executedCommand = command
      },
      deleteImage () {
        this.isLoading = true
        const command = `docker image rm ${this.repository}:${this.tag}`
        this.runCommand(command)
        this.executedCommand = command
      }
    },
    props: {
      repository: {
        type: String,
        required: true
      },
      tag: {
        type: String,
        required: true
      },
      imageId: {
        type: String,
        required: true
      },
      created: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        commandSucceeded: null,
        commandError: null,
        input: null,
        showRunContainer: null,
        executedCommand: null,
        isLoading: false
      }
    },
    components: {
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
span
  font-size: 15px
  font-weight: 500
</style>
