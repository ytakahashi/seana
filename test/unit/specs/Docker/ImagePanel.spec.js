/* eslint no-unused-expressions: 0 */

import ImagePanel from '@/components/Docker/ImagePanel'
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'

describe('ImagePanel.vue', () => {
  let stub
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

  before(() => {
    const runCmd = `docker run ${repository}:${tag}`
    const deleteCmd = `docker image rm ${imageId}`
    stub = sinon.stub(wrapper.vm, 'runCommand')
    stub.withArgs(runCmd).returns('container started')
    stub.withArgs(deleteCmd).returns('container stopped')
  })

  it('should render correct contents', () => {
    const p = wrapper.find('p').text()
    const expected = 'foo/bar:image:1.0   ImageID: 79a4aac10f21 \n      - created: 1 week ago \n      - size: 100MB'
    expect(p).to.equal(expected)
  })

  it('starts container/removes image', () => {
    expect(wrapper.find('.has-addons').isVisible()).to.be.false

    wrapper.vm.runContainer()
    const ectecped1 = { input: null, showRunContainer: true, executedCommand: null }
    expect(wrapper.vm.$data).to.deep.equal(ectecped1)

    wrapper.vm.execRunContainer(repository, tag, null)
    const ectecped2 = { input: null, showRunContainer: true, executedCommand: 'docker run  foo/bar:image:1.0' }
    expect(wrapper.vm.$data).to.deep.equal(ectecped2)

    wrapper.vm.deleteImage()
    const ectecped3 = { input: null, showRunContainer: true, executedCommand: 'docker image rm 79a4aac10f21' }
    expect(wrapper.vm.$data).to.deep.equal(ectecped3)

    expect(wrapper.find('.has-addons').isVisible()).to.be.true
  })

  after(() => {
    stub.restore()
  })
})
