(function () {
  var states = {
    name: '',
    messages: []
  }

  function init() {
    // Init F7 Vue Plugin
    Vue.use(Framework7Vue)

    // Init Page Components
    Vue.component('page-chat', {
      template: '#page-chat',
      data: function() {
        return states
      },
      methods: {
        onSend: function(text, clear) {
          if(text.trim().length === 0) {
            return
          }
          // TODO
          if (typeof clear == 'function') {
            clear()
          }
        }
      }
    })

    // Init App
    new Vue({
      el: '#app',
      data: function() {
        return states
      },
      methods: {
        enterChat: function() {
          if (this.name.trim().length === 0) {
            alert('Please enter your name')
            return false
          }

          this.messages.length = 0
          this.$f7.mainView.router.load({ url: '/chat/' })
        }
      },
      framework7: {
        root: '#app',
        // material: true,
        routes: [
          {
            path: '/chat/',
            component: 'page-chat'
          }
        ],
      }
    });
  }

  // Handle device ready event
  // Note: You may want to check out the vue-cordova package on npm for cordova specific handling with vue - https://www.npmjs.com/package/vue-cordova
  document.addEventListener('deviceready', init, false)
})();
