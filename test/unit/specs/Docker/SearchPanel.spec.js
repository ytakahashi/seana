import SearchPanel from '@/components/Docker/SearchPanel'

describe('DockerContainers.vue', () => {
  it('can create ecpected DockerContainers object', () => {
    const localThis = {
      imageList: null
    }
    const result = [
      'foo#Test official build.#1000#[OK]#',
      'test/repository1#Test 2#118#[OK]#[OK]',
      'ytakahashi/test#Test 3#99##[OK]',
      ''
    ]
    SearchPanel.methods.updateResults.call(localThis, result)

    const expected0 = { name: 'foo', description: 'Test official build.', stars: 1000, official: true, automated: false }
    const expected1 = { name: 'test/repository1', description: 'Test 2', stars: 118, official: true, automated: true }
    const expected2 = { name: 'ytakahashi/test', description: 'Test 3', stars: 99, official: false, automated: true }

    expect(localThis.imageList).to.be.an('array').that.has.lengthOf(3)
    expect(localThis.imageList[0]).to.deep.equal(expected0)
    expect(localThis.imageList[1]).to.deep.equal(expected1)
    expect(localThis.imageList[2]).to.deep.equal(expected2)
  })
})
