/* eslint no-multi-str: 0 */
/* eslint no-unused-expressions: 0 */

import ContainerPanel from '@/components/Docker/ContainerPanel'
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'

describe('ContainerPanel.vue', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(ContainerPanel, {
      propsData: {
        containerId: '2f7ca995e162',
        image: 'image:1.0',
        command: '"foo"',
        created: '2 weeks ago',
        status: 'Up 11 seconds',
        ports: '0.0.0.0:1000->1000/tcp',
        names: 'test1'
      }
    })

    const p = wrapper.find('p').text()
    const expected =
      '- Image: image:1.0 \n\
      - created: 2 weeks ago \n\
      - command: "foo" \n\
      - status: Up 11 seconds \n\
      - ports: 0.0.0.0:1000->1000/tcp'

    expect(p).to.equal(expected)
  })
})

describe('ContainerPanel.vue (2)', () => {
  let stub
  const containerId = 'conatiner1'
  const wrapper = shallowMount(ContainerPanel, {
    propsData: {
      containerId: '2f7ca995e162',
      image: 'image:1.0',
      command: '"foo"',
      created: '2 weeks ago',
      status: 'Up 11 seconds',
      ports: '0.0.0.0:1000->1000/tcp',
      names: 'test1'
    }
  })

  before(() => {
    const startCmd = `docker start ${containerId}`
    const stopCmd = `docker stop ${containerId}`
    const rmCmd = `docker rm ${containerId}`
    stub = sinon.stub(wrapper.vm, 'runCommand')
    stub.withArgs(startCmd).returns('container started')
    stub.withArgs(stopCmd).returns('container stopped')
    stub.withArgs(rmCmd).returns('container removed')
  })

  it('starts container', () => {
    wrapper.vm.startContainer(containerId)
    const expected = { executed: 'start', commandResult: 'container started', running: true, stopping: false, deleted: false }
    expect(wrapper.vm.$data).to.deep.equal(expected)
  })

  it('stops container', () => {
    wrapper.vm.stopContainer(containerId)
    const expected = { executed: 'stop', commandResult: 'container stopped', running: false, stopping: true, deleted: false }
    expect(wrapper.vm.$data).to.deep.equal(expected)
  })

  it('removes container', () => {
    wrapper.vm.deleteContainer(containerId)
    const expected = { executed: 'rm', commandResult: 'container removed', running: false, stopping: false, deleted: true }
    expect(wrapper.vm.$data).to.deep.equal(expected)
  })

  after(() => {
    stub.restore()
  })
})

describe('ContainerPanel.vue (3)', () => {
  it('can correctly reflect container status (running)', () => {
    const wrapper = shallowMount(ContainerPanel, {
      propsData: {
        containerId: '2f7ca995e162',
        image: 'image:1.0',
        command: '"foo"',
        created: '2 weeks ago',
        status: 'Up 11 seconds',
        ports: '0.0.0.0:1000->1000/tcp',
        names: 'test1'
      }
    })

    expect(wrapper.vm.$data.running).to.be.true
    expect(wrapper.vm.$data.stopping).to.be.null
  })

  it('can correctly reflect container status (stopping)', () => {
    const wrapper = shallowMount(ContainerPanel, {
      propsData: {
        containerId: '2f7ca995e162',
        image: 'image:1.0',
        command: '"foo"',
        created: '2 weeks ago',
        status: 'Exited (1) 10 minutes ago',
        ports: '0.0.0.0:1000->1000/tcp',
        names: 'test1'
      }
    })

    expect(wrapper.vm.$data.running).to.be.null
    expect(wrapper.vm.$data.stopping).to.be.true
  })
})
