/* eslint no-unused-expressions: 0 */

import DockerContainers from '@/components/DockerContainers'
import { shallowMount } from '@vue/test-utils'

describe('DockerContainers.vue', () => {
  it('can create ecpected DockerContainers object', () => {
    const localThis = {
      input: '',
      result: null,
      containerCmdCalled: null,
      containerList: null
    }
    const strL = [
      '57dce3fcc614#image1#"foo"#26 hours ago#Up 8 hours#0.0.0.0:6400->6379/tcp#test1',
      '0f3fb512c943#image2#"bar"#10 minutes ago#Exited (0) 1 minute ago##test2',
      ''
    ]
    DockerContainers.methods.updateContainerList.call(localThis, strL)

    const expected0 = { containerId: '57dce3fcc614', image: 'image1', command: '"foo"', created: '26 hours ago', status: 'Up 8 hours', ports: '0.0.0.0:6400->6379/tcp', names: 'test1' }
    const expected1 = { containerId: '0f3fb512c943', image: 'image2', command: '"bar"', created: '10 minutes ago', status: 'Exited (0) 1 minute ago', ports: 'N/A', names: 'test2' }

    expect(localThis.input).to.equal('')
    expect(localThis.result).to.be.null
    expect(localThis.containerCmdCalled).to.be.true
    expect(localThis.containerList).to.be.an('array').that.has.lengthOf(2)
    expect(localThis.containerList[0]).to.deep.equal(expected0)
    expect(localThis.containerList[1]).to.deep.equal(expected1)
  })

  const stubs = ['b-field', 'b-select', 'b-input', 'b-switch']
  const container1 = { names: 'test', image: 'sample1', status: 'Up 8 hours', containerId: 'containerId', command: 'command', created: 'created', ports: 'ports' }
  const container2 = { names: 'foo', image: 'alpine', status: 'Exited (0) 1 minute ago', containerId: 'containerId', command: 'command', created: 'created', ports: 'ports' }
  const container3 = { names: 'bar', image: 'nginx', status: 'Up 10 minutes', containerId: 'containerId', command: 'command', created: 'created', ports: 'ports' }
  const container4 = { names: 'baz', image: 'ubuntu', status: 'Exited (0) 1 hour ago', containerId: 'containerId', command: 'command', created: 'created', ports: 'ports' }
  const containerList = [container1, container2, container3, container4]

  it('should compute filteredContainers (name: "test")', () => {
    const wrapper = shallowMount(DockerContainers, { stubs: stubs })
    wrapper.setData({
      containerList: containerList,
      searchQuery: 'test'
    })

    expect(wrapper.vm.filteredContainers).to.be.an('array').that.has.lengthOf(1)
    expect(wrapper.vm.filteredContainers[0]).to.deep.equal(container1)
  })

  it('should compute filteredContainers (name: "ba")', () => {
    const wrapper = shallowMount(DockerContainers, { stubs: stubs })
    wrapper.setData({
      containerList: containerList,
      searchQuery: 'ba',
      filterProperty: 'filter_name'
    })

    expect(wrapper.vm.filteredContainers).to.be.an('array').that.has.lengthOf(2)
    expect(wrapper.vm.filteredContainers[0]).to.deep.equal(container3)
    expect(wrapper.vm.filteredContainers[1]).to.deep.equal(container4)
  })

  it('should compute filteredContainers (image: "nginx")', () => {
    const wrapper = shallowMount(DockerContainers, { stubs: stubs })

    wrapper.setData({
      containerList: containerList,
      searchQuery: 'nginx',
      filterProperty: 'filter_image'
    })

    expect(wrapper.vm.filteredContainers).to.be.an('array').that.has.lengthOf(1)
    expect(wrapper.vm.filteredContainers[0]).to.deep.equal(container3)
  })

  it('should compute filteredContainers (status: "Up")', () => {
    const wrapper = shallowMount(DockerContainers, { stubs: stubs })

    wrapper.setData({
      containerList: containerList,
      searchUp: true,
      searchExited: false,
      filterProperty: 'filter_status'
    })

    expect(wrapper.vm.filteredContainers).to.be.an('array').that.has.lengthOf(2)
    expect(wrapper.vm.filteredContainers[0]).to.deep.equal(container1)
    expect(wrapper.vm.filteredContainers[1]).to.deep.equal(container3)
  })
})
