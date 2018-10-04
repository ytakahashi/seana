<template>
  <div class="columns">
    <div class="column is-8 is-offset-2">
      <section>

        <button class="button is-medium is-dark" @click="prompt">
          Search the Docker Hub for images
        </button>

      </section>
    </div>
  </div>
</template>

<script>
  const execSync = require('child_process').execSync

  class DockerSearchResult {
    constructor (source) {
      const ok = '[OK]'
      console.log('source', source)
      const values = source.split('#')
      console.log('values', values)

      this.name = values[0]
      this.description = values[1]
      this.stars = values[2]
      if (values[3] === ok) {
        this.official = true
      } else {
        this.official = false
      }
      if (values[4] === ok) {
        this.automated = true
      } else {
        this.automated = false
      }
    }
  }

  export default {
    data () {
      return {
        imageList: null,
        commandResult: null
      }
    },
    methods: {
      runCommand (command) {
        return execSync(command).toString()
      },
      prompt () {
        this.$dialog.prompt({
          message: `Input image name to search.`,
          inputAttrs: {
            placeholder: ''
          },
          onConfirm: (value) => {
            this.$toast.open(`Searching ${value}...`)
            this.searchImage(value)
          }
        })
      },
      searchImage (value) {
        const res = this.runCommand(`docker search ${value} --format "{{.Name}}#{{.Description}}#{{.StarCount}}#{{.IsOfficial}}#{{.IsAutomated}}"`)
        console.log(res)
        this.updateResults(res.split(/\r\n|\r|\n/))
      },
      updateResults (textArray) {
        this.imageCmdCalled = true

        this.imageList = []
        for (let i = 0; i < textArray.length - 1; i++) {
          this.imageList.push(new DockerSearchResult(textArray[i]))
        }

        if (this.imageList.length === 0) {
          console.log('No Images.')
        }
      }
    }
  }
</script>
