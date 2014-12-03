'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TopicService
 * @description
 * # TopicService
 * Topic Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Topic', function(ENV, $resource, $log, User) {
  var resource =  $resource(ENV.api + '/topic/:id', {
    id: '@id',
  }, {
    reply: {
      method: 'post',
      url: ENV.api + '/topic/:topicId/replies'
    },
    upReply: {
      method: 'post',
      url: ENV.api + '/reply/:replyId/ups'
    }
  });
  return {
    getById: function(id) {
      return resource.get({id: id});
    },
    saveReply: function(topicId, replyData) {
      var currentUser = User.getCurrentUser();
      return resource.reply({
        topicId: topicId,
        accesstoken: currentUser.accesstoken
      }, replyData
      );
    },
    upReply: function(replyId) {
      var currentUser = User.getCurrentUser();
      return resource.upReply({
        replyId: replyId,
        accesstoken: currentUser.accesstoken
      }, null, function(response) {
        if (response.success) {
          angular.forEach(topic.replies, function(reply, key) {
            if (reply.id === replyId) {
              if (response.action === 'up') {
                reply.ups.push('');
              } else {
                reply.ups.pop();
              }
            }
          });
        }
      }
      );
    }
  };
});
