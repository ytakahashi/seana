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

      <div class="column is-8 is-offset-2">

        <image-panel v-if="imageCmdCalled" v-for="image in imageList" :key="image.imageId+image.tag+image.repository"
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
  const exec = require('child_process').exec
  const execute = (arg) => promisify(exec)(arg)

  class DockerImage {
    constructor (source) {
      const values = source.split(/\s\s+/)
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
        input: '',
        result: null,
        imageCmdCalled: null,
        imageList: null
      }
    },
    mounted () {
      this.callImage()
    },
    methods: {
      async callImage () {
        const val = await execute('docker images')
        const textArray = val.split(/\r\n|\r|\n/)
        this.imageCmdCalled = true
        this.containerCmdCalled = false

        this.imageList = []
        for (let i = 1; i < textArray.length - 1; i++) {
          this.imageList.push(new DockerImage(textArray[i]))
        }

        if (this.imageList.length === 0) {
          console.log('No Images.')
        }
      }
    }
  }
</script>
