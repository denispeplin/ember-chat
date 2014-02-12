$(function() {
  var token = $('meta[name="csrf-token"]').attr('content');
  $.ajaxPrefilter(function(options, originalOptions, xhr) {
    xhr.setRequestHeader('X-CSRF-Token', token);
  });
});