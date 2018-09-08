<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">

      <article v-if="err" class="message is-danger">
        <div class="message-header">
          <p>Danger</p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          Command 'docker -v' is not available. <br />
          Please make sure docker command is installed and available.
        </div>
      </article>

      <article v-else class="message is-info">
        <div class="message-header">
          <p>Docker version</p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          {{ version }}
        </div>
      </article>

    </div>
  </div>
</template>


<script>
  // const {promisify} = require('util')
  // const exec = require('child_process').exec

  // const execPromise = promisify(exec)

  export default {
    data () {
      return {
        version: null,
        err: null
      }
    },
    methods: {
      async checkVersion () {
        // const result = await execPromise('docker -v')
        //   .catch(this.handleError)
        //   .then(r => r)

        // this.version = result
        this.version = process.env.PATH
      },
      handleError () {
        this.err = true
      }
    },
    mounted () {
      this.checkVersion()
    }
  }
</script>


<style>
  /* CSS */
</style>
