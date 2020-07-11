<template>
  <div class="box">

    <div class="columns">
      <div class="column is-three-quarters">
        <p class="box-list-title">{{ names }} <span>(ID: {{ containerId }})</span></p>
      </div>

      <b-taglist v-if="deleted" attached>
        <b-tag type="is-danger">Deleted</b-tag>
      </b-taglist>
      <b-taglist v-else-if="running" attached>
        <b-tag type="is-info">Up</b-tag>
      </b-taglist>
      <b-taglist v-else-if="stopping" attached>
        <b-tag type="is-warning">Exited</b-tag>
      </b-taglist>

    </div>

    <div class="content">
      <ul class="box-list-text">
        <li>Image: {{ image }}</li>
        <li>created: {{ created }}</li>
        <li>command: {{ command }}</li>
        <li>status: {{ status }}</li>
        <li>ports: {{ ports }}</li>
      </ul>
    </div>

    <div class="content">
      <a v-if="stopping" class="button is-info is-outlined" @click="startContainer(containerId)">Start This Container</a>
      <a v-if="running" class="button is-info is-outlined" @click="stopContainer(containerId)">Stop This Container</a>
      <a v-if="stopping" class="button is-danger is-outlined" @click="deleteContainer(containerId)">Delete This Container</a>
    </div>

    <div class="content">
      <div class="field has-addons" v-if="commandSucceeded">

        <div class="field has-addons" v-if="command">

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

  const { exec } = window.require("child_process")

  export default {
    props: {
      containerId: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      command: {
        type: String,
        required: true
      },
      created: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      ports: {
        type: String,
        required: true
      },
      names: {
        type: String,
        required: true
      }
    },
    methods: {
      runCommand (cmd, callback) {
        exec(cmd, (error, stdout, stderr) => { // eslint-disable-line no-unused-vars
          if (error) {
            this.commandError = String(error)
            this.commandSucceeded = false
            this.isLoading = false
            return
          }
          callback()
          this.commandSucceeded = true
          this.isLoading = false
        })
      },
      startContainer (containerId) {
        this.isLoading = true
        this.executedCommand = `docker start ${containerId}`
        const callback = () => {
          this.deleted = false
        }
        this.runCommand(this.executedCommand, callback)
      },
      stopContainer (containerId) {
        this.isLoading = true
        this.executedCommand = `docker stop ${containerId}`
        const callback = () => {
          this.deleted = false
        }
        this.runCommand(this.executedCommand, callback)
      },
      deleteContainer (containerId) {
        this.isLoading = true
        this.executedCommand = `docker rm ${containerId}`
        const callback = () => {
          this.deleted = true
        }
        this.runCommand(this.executedCommand, callback)
      }
    },
    data () {
      return {
        commandSucceeded: null,
        commandError: null,
        deleted: null,
        executedCommand: null,
        isLoading: false
      }
    },
    computed: {
      running () {
        const containerStatus = this.status.split(/\s/)[0]
        if (containerStatus === 'Up') {
          return true
        } else {
          return false
        }
      },
      stopping () {
        const containerStatus = this.status.split(/\s/)[0]
        if (containerStatus === 'Exited') {
          return true
        } else {
          return false
        }
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
