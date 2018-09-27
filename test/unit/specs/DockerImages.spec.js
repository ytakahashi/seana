/* eslint no-unused-expressions: 0 */

import DockerImages from '@/components/DockerImages'

describe('DockerImages.vue', () => {
  it('can create ecpected DockerImage object', () => {
    const localThis = {
      input: '',
      result: null,
      imageCmdCalled: null,
      imageList: null
    }

    const strL = [
      'REPOSITORY   TAG   IMAGE ID      CREATED       SIZE',
      'test1        1.0   20345f4a149c  3 weeks ago   100MB',
      'test2        1.1   4382e9a772bf  2 months ago  200MB',
      ''
    ]

    DockerImages.methods.updateImageList.call(localThis, strL)

    const expected0 = { repo: 'test1', tag: '1.0', imageId: '20345f4a149c', created: '3 weeks ago', size: '100MB' }
    const expected1 = { repo: 'test2', tag: '1.1', imageId: '4382e9a772bf', created: '2 months ago', size: '200MB' }

    expect(localThis.input)
      .to.equal('')
    expect(localThis.result)
      .to.be.null
    expect(localThis.imageCmdCalled)
      .to.be.true
    expect(localThis.imageList)
      .to.be.an('array')
      .that.has.lengthOf(2)
    expect(localThis.imageList[0]).to.deep.equal(expected0)
    expect(localThis.imageList[1]).to.deep.equal(expected1)
  })
})
