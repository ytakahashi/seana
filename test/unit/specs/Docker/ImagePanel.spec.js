/* eslint no-unused-expressions: 0 */

import ImagePanel from '@/components/Docker/ImagePanel'
import { shallowMount } from '@vue/test-utils'

describe('ImagePanel.vue', () => {
  const stubs = ['b-tag', 'b-taglist', 'b-input']
  const repository = 'foo/bar'
  const tag = 'image:1.0'
  const imageId = '79a4aac10f21'
  const wrapper = shallowMount(ImagePanel, {
    propsData: {
      repository: repository,
      tag: tag,
      imageId: imageId,
      created: '1 week ago',
      size: '100MB'
    },
    stubs: stubs
  })

  it('should render correct contents', () => {
    const p = wrapper.find('p').text()
    const li = wrapper.findAll('li')

    expect(p).to.equal('foo/bar:image:1.0 (ID: 79a4aac10f21)')
    expect(li.length).to.equal(2)
    expect(li.at(0).text()).to.equal('created: 1 week ago')
    expect(li.at(1).text()).to.equal('size: 100MB')
  })
})
