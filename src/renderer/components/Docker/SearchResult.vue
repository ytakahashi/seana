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

        <div class="pull-succeed-msg-box">
            <p>following command has been run:</p>
            <code>
            $ {{ command }}
            </code>
        </div>

        <!-- <article class="message is-warning">
          <div class="message-body">
            following command has been run: <br />
            <code>
            $ {{ command }}
            </code>
          </div>
        </article> -->

      </div>
    </div>

    <div class="pull-err-msg-box" v-if="pullError">
      <span class="box-title">Failed to pull image.</span>
      <pre>{{ pullError }}</pre>
    </div>

  </div>

</template>

<script>
  const { shell } = require('electron')
  const { exec } = require('child_process')

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
        exec(cmd, (error, stdout, stderr) => {
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

<style scoped>
  .pull-succeed-msg-box {
      padding: 2em 1em;
      margin: 0em;
      color: #474747;
      background: rgb(246, 253, 252);
      border-left: double 7px #4ec4d3;
      border-right: double 7px #4ec4d3;
  }

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
