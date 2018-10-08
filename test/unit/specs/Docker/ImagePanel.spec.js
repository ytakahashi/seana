/* eslint no-unused-expressions: 0 */

import ImagePanel from '@/components/Docker/ImagePanel'
import { shallowMount } from '@vue/test-utils'

describe('ImagePanel.vue', () => {
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
    }
  })

  it('should render correct contents', () => {
    const p = wrapper.find('p').text()
    const expected = 'foo/bar:image:1.0   ImageID: 79a4aac10f21 \n      - created: 1 week ago \n      - size: 100MB'
    expect(p).to.equal(expected)
  })
})
