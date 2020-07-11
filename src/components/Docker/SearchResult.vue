<template>
  <div class="box">

    <div class="content">
      <p>
        <font size="4"><strong>{{ name }} </strong></font>
      </p>

      <b-field grouped group-multiline>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">stars</b-tag>
            <b-tag type="is-success">{{ stars }}</b-tag>
          </b-taglist>
        </div>

        <span v-if="official" class="tag is-success">official</span>

        <div v-if="automated" class="control">
          <b-taglist attached>
            <b-tag type="is-dark">docker build</b-tag>
            <b-tag type="is-info">automated</b-tag>
          </b-taglist>
        </div>
      </b-field>

      <p>
        {{ description }}
      </p>

      <a class="button is-link is-outlined" @click="view">
        View on Browser
      </a>
      <a class="button is-link is-outlined" @click="pull">
        Pull This Image
      </a>
    </div>

    <div class="content">
      <div class="field has-addons" v-if="command">

        <div class="command-succeed-msg-box">
            <p>following command has been run:</p>
            <code>
            $ {{ command }}
            </code>
        </div>

      </div>
    </div>

    <div class="command-err-msg-box" v-if="pullError">
      <span class="box-title">Failed to pull image.</span>
      <pre>{{ pullError }}</pre>
    </div>

  </div>

</template>

<script>
  const { exec } = window.require('child_process')
  const electron = window.require('electron')
  const shell = electron.shell

  export default {
    data () {
      return {
        command: null,
        pullError: null,
        isLoading: false
      }
    },
    props: {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      stars: {
        type: Number,
        required: true
      },
      official: {
        type: Boolean,
        required: true
      },
      automated: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      dockerPull (name, loading) {
        const cmd = `docker pull ${name}`
        exec(cmd, (error, stdout, stderr) => { // eslint-disable-line no-unused-vars
          if (error) {
            this.pullError = String(error)
            loading.close()
            console.log(this.pullError)
            return
          }
          this.command = cmd
          loading.close()
        })
      },
      view () {
        const baseUrl = 'https://hub.docker.com/'
        const path = this.official
          ? '_'
          : 'r'

        shell.openExternal(`${baseUrl}${path}/${this.name}`)
      },
      pull () {
        const loading = this.$loading.open()
        this.dockerPull(this.name, loading)
      }
    }
  }
</script>
