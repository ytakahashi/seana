<template>

  <div id="wrapper">

    <div class="container">

      <div class="tabs is-toggle is-fullwidth">
        <ul>
          <li><router-link to="/">Top</router-link></li>
          <li>
            <router-link to="/container">Containers</router-link>
          </li>
          <li class="is-active">
              <router-link to="/image">Images</router-link>
          </li>
        </ul>
      </div>

      <div class="columns"><div class="column"></div></div>

      <div class="columns">

        <div class="column is-half is-offset-2 listing-message" v-if="imageList">
          You have {{ imageList.length }} images.
        </div>

        <div class="column" v-if="imageCmdCalled">
          <a class="button is-outlined" @click="callImage(true)">Refresh</a>
        </div>

      </div>

      <div v-if="imageCmdCalled" class="column is-8 is-offset-2">

        <b-field grouped>

          <b-field label="Filter by">
            <b-select placeholder="Select filter" v-model="filterProperty">
              <option value="filter_name" selected>
                Repository Name
              </option>
              <option value="filter_id">
                Image ID
              </option>
            </b-select>
          </b-field>

          <b-field label="Query" expanded>
            <b-input
              placeholder="Filter images..."
              type="search"
              v-model="searchQuery">
            </b-input>
          </b-field>

        </b-field>

        <image-panel v-for="image in filteredImages" :key="image.repo+image.tag+image.imageId"
          :repository="image.repo"
          :tag="image.tag"
          :imageId="image.imageId"
          :created="image.created"
          :size="image.size">
        </image-panel>

      </div>

    </div>
  </div>

</template>

<script>
  import ImagePanel from './Docker/ImagePanel'

  const {promisify} = require('util')
  const childProcess = window.require("child_process")
  const execute = promisify(childProcess.exec)

  class DockerImage {
    constructor (source) {
      const values = source.split('#')
      this.repo = values[0]
      this.tag = values[1]
      this.imageId = values[2]
      this.created = values[3]
      this.size = values[4]
    }
  }

  export default {
    components: {
      ImagePanel
    },
    data () {
      return {
        filterProperty: '',
        searchQuery: '',
        input: '',
        result: null,
        imageCmdCalled: null,
        imageList: null
      }
    },
    mounted () {
      this.callImage(false)
    },
    computed: {
      filteredImages () {
        const query = this.searchQuery
        if (this.imageList === null) {
          return null
        }
        if (this.filterProperty === 'filter_name') {
          return this.imageList.filter(
            image => image.repo.indexOf(query) !== -1
          )
        } else if (this.filterProperty === 'filter_id') {
          return this.imageList.filter(
            image => image.imageId.indexOf(query) !== -1
          )
        }
        return this.imageList.filter(
          image => image.repo.indexOf(query) !== -1
        )
      }
    },
    methods: {
      async callImage (showsToast) {
        const val = await execute('docker image ls --format "{{.Repository}}#{{.Tag}}#{{.ID}}#{{.CreatedSince}} ago#{{.Size}}"')
        this.updateImageList(val.split(/\r\n|\r|\n/))
        if (showsToast) {
          this.showRefreshedMessage()
        }
      },
      updateImageList (textArray) {
        this.imageCmdCalled = true

        this.imageList = []
        for (let i = 0; i < textArray.length - 1; i++) {
          this.imageList.push(new DockerImage(textArray[i]))
        }

        if (this.imageList.length === 0) {
          console.log('No Images.')
        }
      },
      showRefreshedMessage () {
        this.$toasted.show(
          'Refreshed docker images.',
          {
            theme: "outline",
            position: "top-right",
            duration : 2000
          }
        )
      }
    }
  }
</script>
