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
      <div class="field has-addons" v-if="executed">

        <article class="message is-warning">
          <div class="message-body">
            following command has been run: <br />
            <code>
            $ docer {{ executed }} {{ containerId }}
            </code>
          </div>
        </article>

      </div>
    </div>

  </div>
</template>

<script>
  const execSync = require('child_process').execSync

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
      runCommand (command) {
        return execSync(command).toString()
      },
      startContainer (containerId) {
        this.commandResult = this.runCommand(`docker start ${containerId}`)
        this.running = true
        this.stopping = false
        this.deleted = false
        this.executed = 'start'
      },
      stopContainer (containerId) {
        this.commandResult = this.runCommand(`docker stop ${containerId}`)
        this.running = false
        this.stopping = true
        this.deleted = false
        this.executed = 'stop'
      },
      deleteContainer (containerId) {
        this.commandResult = this.runCommand(`docker rm ${containerId}`)
        this.running = false
        this.stopping = false
        this.deleted = true
        this.executed = 'rm'
      }
    },
    data () {
      return {
        executed: null,
        commandResult: null,
        running: null,
        stopping: null,
        deleted: null
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
