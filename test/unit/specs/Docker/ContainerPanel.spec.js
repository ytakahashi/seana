/* eslint no-multi-str: 0 */
/* eslint no-unused-expressions: 0 */

import ContainerPanel from '@/components/Docker/ContainerPanel'
import { shallowMount } from '@vue/test-utils'

describe('ContainerPanel.vue', () => {
  const stubs = ['b-tag', 'b-taglist', 'b-input']

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
      },
      stubs: stubs
    })

    const p = wrapper.find('p').text()
    const li = wrapper.findAll('li')

    expect(p).to.equal('test1 (ID: 2f7ca995e162)')
    expect(li.length).to.equal(5)
    expect(li.at(0).text()).to.equal('Image: image:1.0')
    expect(li.at(1).text()).to.equal('created: 2 weeks ago')
    expect(li.at(2).text()).to.equal('command: "foo"')
    expect(li.at(3).text()).to.equal('status: Up 11 seconds')
    expect(li.at(4).text()).to.equal('ports: 0.0.0.0:1000->1000/tcp')
  })
})

describe('ContainerPanel.vue (2)', () => {
  const stubs = ['b-tag', 'b-taglist', 'b-input']

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
      },
      stubs: stubs
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
      },
      stubs: stubs
    })

    expect(wrapper.vm.$data.running).to.be.null
    expect(wrapper.vm.$data.stopping).to.be.true
  })
})
