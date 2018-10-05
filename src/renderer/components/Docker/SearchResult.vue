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
        {{ description }} <br />
        - official: {{ official }}
        - automated: {{ automated }}
      </p>

      <a class="button is-link is-outlined" @click="view">
        View on Browser
      </a>
      <a class="button is-link is-outlined" @click="pull">
        Pull This Image
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
      </a>
    </div>

    <div class="content">
      <div class="field has-addons" v-if="command">

        <article class="message is-warning">
          <div class="message-body">
            following command has been run: <br />
            <code>
            $ {{ command }}
            </code>
          </div>
        </article>

      </div>
    </div>

  </div>

</template>

<script>
  const { shell } = require('electron')
  const execSync = require('child_process').execSync

  export default {
    data () {
      return {
        command: null,
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
      view () {
        const baseUrl = 'https://hub.docker.com/'
        const path = this.official
          ? '_'
          : 'r'

        shell.openExternal(`${baseUrl}${path}/${this.name}`)
      },
      pull () {
        this.isLoading = true
        this.command = `docker pull ${this.name}`
        const result = execSync(this.command).toString()
        console.log(result)
        this.isLoading = false
      }
    }
  }
</script>
