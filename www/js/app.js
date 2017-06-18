(function () {
  var channel = 'myChannel'

  var pubNubSettings = {
    channels: [channel]
  }

  pubNubSettings.history = {
    channel: channel,
    count: 20
  }

  var pubNub = new PubNub({
    publishKey: 'pub-c-9aca2794-bfde-4d6c-864e-41e8299df324',
    subscribeKey: 'sub-c-99fedc28-544d-11e7-995f-02ee2ddab7fe'
  })

  var states = {
    name: '',
    messages: []
  }

  function pushMessage(chatMessage) {
    if(chatMessage == undefined) {
      return false;
    }
    var type = chatMessage.name == states.name ? 'sent' : 'received';
    var name = type == 'sent' ? states.name : chatMessage.name;
    states.messages.push({
      name: name,
      text: chatMessage.text,
      type: type
    })
  }

  function initPubNub() {
    pubNub.addListener({
      message: function(data) {
        pushMessage(data.message)
      }
    })

    pubNub.subscribe({
      channels: pubNubSettings.channels,
    })

    pubNub.history(pubNubSettings.history, function(status, response) {
      var history = response.messages;
      for (var i = 0; i < history.length; i++) {
        pushMessage(history[i].entry)
      }
    })
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
          pubNub.publish({
            channel: channel,
            message: {
              text: text,
              name: this.name
            }
          })
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
          initPubNub();
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
