<template>

<div id="wrapper">
  <div class="container">
    <div class="column is-half is-offset-one-quarter">

      <a class="button is-primary is-outlined" @click="callImage">Images</a>
      <a class="button is-link is-outlined" @click="callContainer">Containers</a>
    </div>

    <br />
    
    <div class="column is-half is-offset-one-quarter">

      <image-panel v-if="imageCmdCalled" v-for="image in imageList" :key="image.imageId+image.tag+image.repository"
        :repository="image.repo"
        :tag="image.tag"
        :imageId="image.imageId"
        :created="image.created"
        :size="image.size">
      </image-panel>

      <container-panel v-if="containerCmdCalled" v-for="container in containerList" :key="container.containerId+container.created"
        :containerId="container.containerId"
        :image="container.image"
        :command="container.command"
        :created="container.created"
        :status="container.status"
        :ports="container.ports"
        :names="container.names">
      </container-panel>
    </div>

  </div>
</div>

</template>

<script>
  import ImagePanel from './Docker/ImagePanel'
  import ContainerPanel from './Docker/ContainerPanel'

  const {promisify} = require('util')
  var exec = require('child_process').exec
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

  class DockerContainer {
    constructor (source) {
      const values = source.split(/\s\s+/)
      this.containerId = values[0]
      this.image = values[1]
      this.command = values[2]
      this.created = values[3]
      this.status = values[4]
      if (isNaN(values[5])) {
        this.ports = 'N/A'
        this.names = values[5]
      } else {
        this.ports = values[5]
        this.names = values[6]
      }
    }
  }

  export default {
    components: {
      ImagePanel,
      ContainerPanel
    },
    data () {
      return {
        input: '',
        result: null,
        imageCmdCalled: null,
        containerCmdCalled: null,
        imageList: null,
        containerList: null
      }
    },
    methods: {
      async call () {
        const val = await execute('docker images')
        this.result = val
      },
      async callImage () {
        const val = await execute('docker images')
        const textArray = val.split(/\r\n|\r|\n/)
        this.imageCmdCalled = true
        this.containerCmdCalled = false

        this.imageList = []
        for (let i = 1; i < textArray.length - 1; i++) {
          this.imageList.push(new DockerImage(textArray[i]))
        }
      },
      async callContainer () {
        const val = await execute('docker container ls -a')
        const textArray = val.split(/\r\n|\r|\n/)
        this.imageCmdCalled = false
        this.containerCmdCalled = true

        this.containerList = []
        for (let i = 1; i < textArray.length - 1; i++) {
          this.containerList.push(new DockerContainer(textArray[i]))
        }

        if (this.containerList.length === 0) {
          console.log('NO CONTAINERS')
        }
      }
    }
  }
</script>

<style scoped>
  samp {
  background: #000;
  border: 3px groove #ccc;
  color: #ccc;
  display: block;
  padding: 5px;
  width: 500px;
}
</style>
