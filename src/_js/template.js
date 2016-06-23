(function(window) {
  "use strict";

  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;'
  };

  var escapeHtmlChar = function (chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  var escape = function (string) {
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  };

  var getTime = function(date) {
    var time = new Date(date),
        timeStr = time.getHours() + ':' + time.getMinutes();

    return timeStr;
  };

  function Template() {
    this.noteTemplate
      = "<li data-id='{{id}}' class='notes-list__item {{completed}}'>"
      +   "<span class='item__date'>{{time}}</span>"
      +   "<span class='item__title'>{{title}}</span>"
      +   "<div class='helpers-buttons'>"
      +     "<input type='checkbox' class='toggle' {{checked}}>"
      +     "<button class='destroy-btn'>✕</button>"
      +   "</div>"
      + "</li>";

    this.countTemplate
      = "<li class='count-list__item done'>Завершенные <span>{{completed}}</span></li>"
      + "<li class='count-list__item undone'>Незавершенные <span>{{active}}</span></li>"
      + "<li class='count-list__item all'>Все задачи <span>{{total}}</span></li>";
  }

  Template.prototype.show = function(data) {
    var view = '';

    for (var i = 0; i < data.length; i++) {
      var template = this.noteTemplate;
      var completed = '';
      var checked = '';

      if (data[i].completed) {
        completed = 'completed';
        checked = 'checked';
      }

      template = template.replace('{{id}}', data[i].id);
      template = template.replace('{{completed}}', completed);
      template = template.replace('{{time}}', getTime(data[i].date));
      template = template.replace('{{title}}', escape(data[i].title));
      template = template.replace('{{checked}}', checked);

      view += template;
    }

    return view;
  };

  Template.prototype.showCounter = function(counts) {
    var countView = this.noteTemplate;

    countView = countView.replace('{{completed}}', counts.completed);
    countView = countView.replace('{{active}}', counts.active);
    countView = countView.replace('{{total}}', counts.total);

    return countView;
  };

  window.app = window.app || {};
  window.app.Template = Template;
}(window));