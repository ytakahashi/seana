<template>
  <div class="box">

    <div class="content">
      <p>
        <font size="4"><strong>{{ repository }}:{{ tag }} </strong></font> <small> ImageID: {{ imageId }}</small>
        <br />
        - created: {{ created }} <br />
        - size: {{ size }}
      </p>

      <a class="button is-link is-outlined" @click="runContainer">Run a container</a>
      <a class="button is-danger is-outlined" @click="deleteImage">Delete This Image</a>
    </div>

    <div class="content">
      <div class="field has-addons" v-if="showRunContainer">
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
      <div class="field has-addons" v-if="executedCommand">

        <article class="message is-warning">
          <div class="message-body">
            following command has been run: <br />
            <code>
            $ {{ executedCommand }}
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
    methods: {
      runContainer () {
        this.showRunContainer = true
      },
      execRunContainer (repository, tag, option) {
        const command = `docker run ${option} ${repository}:${tag}`
        this.commandResult = execSync(command).toString()
        console.log(this.commandResult)
        this.executedCommand = command
      },
      deleteImage () {
        const command = `docker image rm ${this.imageId}`
        this.commandResult = execSync(command).toString()
        console.log(this.commandResult)
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
        input: null,
        showRunContainer: null,
        executedCommand: null
      }
    }
  }
</script>
