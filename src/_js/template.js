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
      this.month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      this.day = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      this.noteTemplate
        = "<li data-id='{{id}}' class='notes-list__item {{completed}}'>"
        +   "<span class='item__date'>{{hours}}:{{minutes}}</span>"
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

  Template.prototype.showNotes = function(data) {
    var view = '';
    console.log(data);
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
      template = template.replace('{{hours}}', data[i].hours);
      template = template.replace('{{minutes}}', data[i].minutes);
      template = template.replace('{{title}}', escape(data[i].title));
      template = template.replace('{{checked}}', checked);

      view += template;
    }

    return view;
  };

  Template.prototype.showCounter = function(counts) {
    var countView = this.countTemplate;

    countView = countView.replace('{{completed}}', counts.completed);
    countView = countView.replace('{{active}}', counts.active);
    countView = countView.replace('{{total}}', counts.total);

    return countView;
  };

  Template.prototype.showMonth = function(m, year) {
    m = parseInt(m, 10);
    return this.month[m] + ' ' + year;
  };
  Template.prototype.showDay = function(day, month, dayName) {
    var d = parseInt(day, 10);
    return    "<p class='date-title'>" + d + " " + this.month[month] + "</p>"
            + "<p class='date-subtitle'>" + this.day[dayName] + "</p>";
  };


  window.app = window.app || {};
  window.app.Template = Template;
}(window));