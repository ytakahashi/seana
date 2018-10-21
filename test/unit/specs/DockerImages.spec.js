/* eslint no-unused-expressions: 0 */

import DockerImages from '@/components/DockerImages'
import { shallowMount } from '@vue/test-utils'

describe('DockerImages.vue', () => {
  it('can create ecpected DockerImage object', () => {
    const localThis = {
      input: '',
      result: null,
      imageCmdCalled: null,
      imageList: null
    }
    const strL = [
      'test1#1.0#20345f4a149c#3 weeks ago#100MB',
      'test2#1.1#4382e9a772bf#2 months ago#200MB',
      ''
    ]
    DockerImages.methods.updateImageList.call(localThis, strL)

    const expected0 = { repo: 'test1', tag: '1.0', imageId: '20345f4a149c', created: '3 weeks ago', size: '100MB' }
    const expected1 = { repo: 'test2', tag: '1.1', imageId: '4382e9a772bf', created: '2 months ago', size: '200MB' }

    expect(localThis.input).to.equal('')
    expect(localThis.result).to.be.null
    expect(localThis.imageCmdCalled).to.be.true
    expect(localThis.imageList).to.be.an('array').that.has.lengthOf(2)
    expect(localThis.imageList[0]).to.deep.equal(expected0)
    expect(localThis.imageList[1]).to.deep.equal(expected1)
  })

  it('should compute filteredImages (name: "test")', () => {
    const image1 = { repo: 'test', tag: '1.0', imageId: 'imageId', created: 'created', size: 'size' }
    const image2 = { repo: 'foo', tag: '2.0', imageId: 'imageId', created: 'created', size: 'size' }
    const image3 = { repo: 'bar', tag: '1.4', imageId: 'imageId', created: 'created', size: 'size' }
    const image4 = { repo: 'baz', tag: '5.0', imageId: 'imageId', created: 'created', size: 'size' }
    const imageList = [image1, image2, image3, image4]

    const wrapper = shallowMount(DockerImages)
    wrapper.setData({
      imageList: imageList,
      searchQuery: 'test'
    })

    expect(wrapper.vm.filteredImages).to.be.an('array').that.has.lengthOf(1)
    expect(wrapper.vm.filteredImages[0]).to.deep.equal(image1)
  })
})
