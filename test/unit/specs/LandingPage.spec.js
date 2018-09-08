import LandingPage from '@/components/LandingPage'
import { shallowMount } from '@vue/test-utils'

describe('LandingPage.vue', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(LandingPage, {
      stubs: {
        CommandInformation: '<div>CommandInformation</div>'
      }
    })

    expect(wrapper.findAll('li')).to.have.length(3)
  })
})
