import Vue from "vue"
import Toasted from "vue-toasted"
import VuejsDialog from "vuejs-dialog"
import App from "./App"
import router from "./router"
import Buefy from "buefy"
import "./assets/seana.styl"
import "buefy/dist/buefy.css"
import "vuejs-dialog/dist/vuejs-dialog.min.css"

Vue.use(Buefy)
Vue.use(Toasted)
Vue.use(VuejsDialog)

new Vue({
  components: { App },
  router,
  template: "<App/>"
}).$mount("#app")
