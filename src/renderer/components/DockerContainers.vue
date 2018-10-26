<template>

  <div id="wrapper">

    <div class="container">

      <div class="tabs is-toggle is-fullwidth">
        <ul>
          <li><router-link to="/">Top</router-link></li>
          <li class="is-active">
            <router-link to="/container">Containers</router-link>
          </li>
          <li>
            <router-link to="/image">Images</router-link>
          </li>
        </ul>
      </div>

      <div class="columns"><div class="column"></div></div>

      <div class="columns">

        <div class="column is-half is-offset-2 listing-message" v-if="containerList">
          You have {{ containerList.length }} containers.
        </div>

        <div class="column" v-if="containerCmdCalled">
          <a class="button is-outlined" @click="callContainer(true)">Refresh</a>
        </div>

      </div>

      <div  v-if="containerCmdCalled" class="column is-8 is-offset-2">

        <b-field grouped>

          <b-field label="Filter by">
            <b-select placeholder="Select filter" v-model="filterProperty">
              <option value="filter_name" selected>
                Container Name
              </option>
              <option value="filter_status">
                Container Status
              </option>
              <option value="filter_image">
                Image Name
              </option>
            </b-select>
          </b-field>

          <section v-if="filterProperty === 'filter_status'">
            <div class="status-filter">
              <p>Status</p>
            </div>

            <div class="status-switches">
              <span class="field">
                <b-switch v-model="searchUp">
                  Show Up
                </b-switch>
              </span>

              <span class="field">
                <b-switch v-model="searchExited">
                  Show Exited
                </b-switch>
              </span>
            </div>
          </section>

          <b-field v-else label="Query" expanded>
            <b-input
              placeholder="Filter containers..."
              type="search"
              v-model="searchQuery">
            </b-input>
          </b-field>

        </b-field>

        <container-panel v-for="container in filteredContainers" :key="container.containerId+container.image"
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
  import ContainerPanel from './Docker/ContainerPanel'

  const {promisify} = require('util')
  const exec = require('child_process').exec
  const execute = (arg) => promisify(exec)(arg)

  class DockerContainer {
    constructor (source) {
      const values = source.split('#')
      this.containerId = values[0]
      this.image = values[1]
      this.command = values[2]
      this.created = values[3]
      this.status = values[4]
      this.ports = values[5] === '' ? 'N/A' : values[5]
      this.names = values[6]
    }
  }

  export default {
    components: {
      ContainerPanel
    },
    data () {
      return {
        filterProperty: '',
        searchQuery: '',
        input: '',
        result: null,
        containerCmdCalled: null,
        containerList: null,
        searchUp: true,
        searchExited: true
      }
    },
    mounted () {
      this.callContainer(false)
    },
    computed: {
      filteredContainers () {
        const query = this.searchQuery
        if (this.containerList === null) {
          return null
        }

        if (this.filterProperty === 'filter_name') {
          return this.containerList.filter(c =>
            c.names.indexOf(query) !== -1
          )
        } else if (this.filterProperty === 'filter_image') {
          return this.containerList.filter(c =>
            c.image.indexOf(query) !== -1
          )
        } else if (this.filterProperty === 'filter_status') {
          const cb = c => {
            if (this.searchUp) {
              if (c.status.startsWith('Up')) {
                return true
              }
            }
            if (this.searchExited) {
              if (c.status.startsWith('Exited')) {
                return true
              }
            }
            return false
          }
          return this.containerList.filter(cb)
        }
        return this.containerList.filter(c =>
          c.names.indexOf(query) !== -1
        )
      }
    },
    methods: {
      async callContainer (showsToast) {
        const val = await execute('docker container ls -a --format "{{.ID}}#{{.Image}}#{{.Command}}#{{.RunningFor}} ago#{{.Status}}#{{.Ports}}#{{.Names}}"')
        this.updateContainerList(val.split(/\r\n|\r|\n/))
        if (showsToast) {
          this.showRefreshedMessage()
        }
      },
      updateContainerList (textArray) {
        this.containerCmdCalled = true

        this.containerList = []
        for (let i = 0; i < textArray.length - 1; i++) {
          this.containerList.push(new DockerContainer(textArray[i]))
        }

        if (this.containerList.length === 0) {
          console.log('No Containers.')
        }
      },
      showRefreshedMessage () {
        this.$toast.open({
          message: 'Refreshed docker containers.',
          type: 'is-success'
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .status-filter
    margin-left: 30px

  .status-switches
    @extend .status-filter
    margin-top: 15px

  p
    font-weight: 600
</style>
