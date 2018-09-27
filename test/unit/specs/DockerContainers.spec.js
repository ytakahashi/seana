/* eslint no-unused-expressions: 0 */

import DockerContainers from '@/components/DockerContainers'

describe('DockerContainers.vue', () => {
  it('can create ecpected DockerContainers object', () => {
    const localThis = {
      input: '',
      result: null,
      containerCmdCalled: null,
      containerList: null
    }

    const strL = [
      'CONTAINER ID   IMAGE    COMMAND   CREATED           STATUS                    PORTS                     NAMES',
      '57dce3fcc614   image1   "foo"     26 hours ago      Up 8 hours                0.0.0.0:6400->6379/tcp    test1',
      '0f3fb512c943   image2   "bar"     10 minutes ago    Exited (0) 1 minute ago                             test2',
      ''
    ]

    DockerContainers.methods.updateContainerList.call(localThis, strL)

    const expected0 = { containerId: '57dce3fcc614', image: 'image1', command: '"foo"', created: '26 hours ago', status: 'Up 8 hours', ports: '0.0.0.0:6400->6379/tcp', names: 'test1' }
    const expected1 = { containerId: '0f3fb512c943', image: 'image2', command: '"bar"', created: '10 minutes ago', status: 'Exited (0) 1 minute ago', ports: 'N/A', names: 'test2' }

    expect(localThis.input)
      .to.equal('')
    expect(localThis.result)
      .to.be.null
    expect(localThis.containerCmdCalled)
      .to.be.true
    expect(localThis.containerList)
      .to.be.an('array')
      .that.has.lengthOf(2)
    expect(localThis.containerList[0]).to.deep.equal(expected0)
    expect(localThis.containerList[1]).to.deep.equal(expected1)
  })
})
