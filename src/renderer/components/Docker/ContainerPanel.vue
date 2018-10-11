<template>
  <div class="box">

    <div class="columns">
      <div class="column is-three-quarters">
        <p class="box-list-title">{{ names }} <span>(ID: {{ containerId }})</span></p>
      </div>

      <b-taglist v-if="running" attached>
        <b-tag type="is-info">Running</b-tag>
      </b-taglist>
      <b-taglist v-if="stopping" attached>
        <b-tag type="is-warning">Stopping</b-tag>
      </b-taglist>
      <b-taglist v-if="deleted" attached>
        <b-tag type="is-danger">Deleted</b-tag>
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

  </div>
</template>

<script>
  const { exec } = require('child_process')

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
      runCommand (cmd, loading, callback) {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            this.commandError = String(error)
            this.commandSucceeded = false
            loading.close()
            return
          }
          callback()
          this.commandSucceeded = true
          loading.close()
        })
      },
      startContainer (containerId) {
        const loading = this.$loading.open()
        this.executedCommand = `docker start ${containerId}`
        const callback = () => {
          this.running = true
          this.stopping = false
          this.deleted = false
        }
        this.runCommand(this.executedCommand, loading, callback)
      },
      stopContainer (containerId) {
        const loading = this.$loading.open()
        this.executedCommand = `docker stop ${containerId}`
        const callback = () => {
          this.running = false
          this.stopping = true
          this.deleted = false
        }
        this.runCommand(this.executedCommand, loading, callback)
      },
      deleteContainer (containerId) {
        const loading = this.$loading.open()
        this.executedCommand = `docker rm ${containerId}`
        const callback = () => {
          this.running = false
          this.stopping = false
          this.deleted = true
        }
        this.runCommand(this.executedCommand, loading, callback)
      }
    },
    data () {
      return {
        commandSucceeded: null,
        commandError: null,
        running: null,
        stopping: null,
        deleted: null,
        executedCommand: null
      }
    },
    mounted () {
      const containerStatus = this.status.split(/\s/)[0]
      if (containerStatus === 'Up') {
        this.running = true
      } else {
        this.stopping = true
      }
    }
  }
</script>

<style lang="stylus" scoped>
span
  font-size: 15px
  font-weight: 500
</style>
