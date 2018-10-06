<template>
  <div class="column is-8 is-offset-2 image-boxes">
    <div class="columns">
      <div class="column is-10 is-offset-1">
        <section>

          <button class="button is-medium is-light is-fullwidth" @click="prompt">
            Search the Docker Hub for images
          </button>

        </section>
      </div>
    </div>

    <div class="columns">

      <div v-if="okToShow" class="column is-10 is-offset-1">

        <search-result v-for="image in imageList" :key="image.name"
          :name="image.name"
          :description="image.description"
          :stars="image.stars"
          :official="image.official"
          :automated="image.automated">
        </search-result>

      </div>

    </div>
  </div>
</template>

<script>
  import SearchResult from './SearchResult'

  const execSync = require('child_process').execSync
  const ok = '[OK]'

  class DockerSearchResult {
    constructor (source) {
      const values = source.split('#')

      this.name = values[0]
      this.description = values[1]
      this.stars = Number(values[2])

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
        okToShow: false
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
        const res = this.runCommand(`docker search "${value}" --no-trunc --format "{{.Name}}#{{.Description}}#{{.StarCount}}#{{.IsOfficial}}#{{.IsAutomated}}"`)
        console.log(res)
        this.updateResults(res.split(/\r\n|\r|\n/))
      },
      updateResults (textArray) {
        this.imageCmdCalled = true

        this.imageList = []
        for (let i = 0; i < textArray.length - 1; i++) {
          this.imageList.push(new DockerSearchResult(textArray[i]))
        }

        this.okToShow = true
        if (this.imageList.length === 0) {
          console.log('No Images.')
        }
      }
    },
    components: {
      SearchResult
    }
  }
</script>

<style scoped>
  .image-boxes {
    margin-top: 5%;
    color: #666;
    background-color: #f7f7f7;
    border: 1px solid #ccc;
  }
</style>
