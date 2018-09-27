/* eslint no-unused-expressions: 0 */

import CommandInformation from '@/components/Docker/CommandInformation'
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'

describe('CommandInformation.vue', () => {
  let stub
  const wrapper = shallowMount(CommandInformation)

  before(() => {
    stub = sinon.stub(wrapper.vm, 'execPromise')
  })

  it('has available docker command', async () => {
    const version = '18.06.1-ce'
    stub.withArgs('docker -v').resolves(version)
    await wrapper.vm.checkVersion()

    const body = wrapper.find('.message-body').text()
    expect(body).to.equal(version)

    const ecpected = { version: '18.06.1-ce', err: null }
    expect(wrapper.vm.$data).to.deep.equal(ecpected)
  })

  it('does not have available docker command', async () => {
    stub.withArgs('docker -v').rejects('err')
    await wrapper.vm.checkVersion()

    const body = wrapper.find('.message-body').text()
    const expected = 'Command \'docker -v\' is not available.'
    expect(body.indexOf(expected) > -1).to.be.true

    const ecpected = { version: undefined, err: true }
    expect(wrapper.vm.$data).to.deep.equal(ecpected)
  })

  after(() => {
    stub.restore()
  })
})
