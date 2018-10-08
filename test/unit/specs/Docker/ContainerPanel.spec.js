/* eslint no-multi-str: 0 */
/* eslint no-unused-expressions: 0 */

import ContainerPanel from '@/components/Docker/ContainerPanel'
import { shallowMount } from '@vue/test-utils'

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
