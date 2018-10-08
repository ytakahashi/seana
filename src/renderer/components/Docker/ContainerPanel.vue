<template>
  <div class="box">

    <div class="columns">
      <div class="column is-three-quarters">
        <font size="4"><strong>{{ names }} ({{ containerId }}) </strong></font>
      </div>
      <div class="column">
        <span v-if="running" class="tag is-info">Running</span>
        <span v-if="stopping" class="tag is-warning">Stopping</span>
        <span v-if="deleted" class="tag is-danger">Deleted</span>
      </div>
    </div>

    <div class="content">
      <p>
        - Image: {{ image }} <br />
        - created: {{ created }} <br />
        - command: {{ command }} <br />
        - status: {{ status }} <br />
        - ports: {{ ports }}
      </p>
    </div>

    <div class="content">
      <a v-if="stopping" class="button is-info is-outlined" @click="startContainer(containerId)">Start This Container</a>
      <a v-if="running" class="button is-info is-outlined" @click="stopContainer(containerId)">Stop This Container</a>
      <a v-if="stopping" class="button is-danger is-outlined" @click="deleteContainer(containerId)">Delete This Container</a>
    </div>

    <div class="content">
      <div class="field has-addons" v-if="commandSucceeded">

        <article class="message is-warning">
          <div class="message-body">
            following command has been run: <br />
            <code>
            $ {{ executedCommand }}
            </code>
          </div>
        </article>

      </div>

      <div class="pull-err-msg-box" v-if="commandError">
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

<style scoped>
  .pull-err-msg-box {
      position: relative;
      padding: 30px 10px 10px;
      border: solid 2px #ff7f50;
      border-radius: 10px 10px 10px 10px;
  }

  .pull-err-msg-box .box-title {
      position: absolute;
      display: inline-block;
      top: -2px;
      left: -2px;
      padding: 0 9px;
      height: 25px;
      line-height: 25px;
      vertical-align: middle;
      font-size: 17px;
      background: #ff7f50;
      color: #ffffff;
      font-weight: bold;
  }
</style>
