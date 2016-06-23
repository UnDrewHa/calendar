(function (window) {
  "use strict";
  window.qs = function(target, scope) {
    return (scope || document).querySelector(target);
  };

  window.qsa = function(target, scope) {
    return (scope || document).querySelectorAll(target);
  };

  window.$on = function(target, type, handler, useCapture) {
    return target.addEventListener(type, handler, !!useCapture);
  };

  window.$delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    var useCapture = type === 'blur' || type === 'focus';

    window.$on(target, type, dispatchEvent, useCapture);
  };

  window.$parent = function(element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  NodeList.prototype.forEach = Array.prototype.forEach;
}(window));
(function(window) {
  'use strict';

    function Store(name, callback) {
      callback = callback || function() {};

      this._dbname = name;

      if (!localStorage[name]) {
        var data = {
          notes: []
        };

        localStorage[name] = JSON.stringify(data);
        callback.call(this, JSON.parse(localStorage[name]));
      }
    }

    Store.prototype.find = function (query, callback) {
      if (!callback) {
        return;
      }

      var notes = JSON.parse(localStorage[this._dbname]).notes;

      callback.call(this, notes.filter(function(note) {
        for (var q in query) {
          if ( query[q] !== note[q]) {
            return false;
          }
        }
        return true;
      }));
    };

    Store.prototype.findAll = function(callback) {
      callback = callback || function() {};
      callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
    };

    Store.prototype.save = function(updateData, callback, id) {
      callback = callback || function() {};

      var data = JSON.parse(localStorage[this._dbname]),
          notes = data.notes;

      if (id) {
        for (var i = 0; i < notes.length; i++) {
          if (notes[i].id === id) {
            for (var key in updateData) {
              notes[i][key] = updateData[key];
            }
            break;
          }
        }
        localStorage[this._dbname] = JSON.parse(data);
        callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
      }
      else {
        updateData.id = new Date().getTime();
        notes.push(updateData);

        localStorage[this._dbname] = JSON.stringify(data);
        callback.call(this, [updateData]);
      }
    };

    Store.prototype.remove = function(id, callback) {
      callback = callback || function() {};

      var data = JSON.parse(localStorage[this._dbname]),
          notes = data.notes;

      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
          notes.splice(i, 1);
          break;
        }
      }

      localStorage[this._dbname] = JSON.stringify(data);
      callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
    };

    Store.prototype.drop = function(callback) {
      callback = callback || function() {};

      localStorage[this._dbname] = JSON.stringify({ notes: []});
      callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
    };

  window.app = window.app || {};
  window.app.Store = Store;
}(window));
(function(window) {
  "use strict";

  function Model(storage) {
    this.storage = storage;
  }

  Model.prototype.create = function(title, date, callback) {
    var data = {
      title: title.trim(),
      date: date,
      completed: false
    };

    this.storage.save(data, callback);
  };

  Model.prototype.find = function(query, callback) {
    var queryType = typeof query;

    if (queryType === 'function') {
      callback = query;
      this.storage.findAll(callback);
    }
    else if (queryType === 'string' || queryType === 'number') {
      query = parseInt(query, 10);
      this.storage.find({id: query}, callback);
    }
    else {
      this.storage.find(query, callback);
    }
  };

  Model.prototype.update = function(data, callback, id) {
    this.storage.save(data, callback, id);
  };

  Model.prototype.remove = function(id, callback) {
    this.storage.remove(id, callback);
  };

  Model.prototype.removeAll = function(callback) {
    this.storage.drop(callback);
  };

  Model.prototype.getCount = function(callback) {
    var notes = {
      active: 0,
      completed: 0,
      total: 0
    };

    this.storage.findAll(function(data) {
      data.forEach(function(note) {
        if (note.completed) {
          notes.completed++;
        }
        else {
          notes.active++;
        }
        notes.total++;
      });
      callback(notes);
    });
  };

  window.app = window.app || {};
  window.app.Model = Model;
}(window));
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
(function(window) {
  "use strict";

  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.$noteList = qs('.notes-list');
    this.$countList = qs('.count-list');
    this.$newNoteBlock = qs('.new-note');
    this.$noteTitle = qs('#note-title');
    this.$noteDate = qs('#note-date');
    this.$addNote = qs('.add-note');
    this.$addButton = qs('.add_note');
  }

  View.prototype._removeItem = function(id) {

  };

  View.prototype._elementComplete = function(id, completed) {

  };

  View.prototype._editItem = function(id, title, date) {

  };

  View.prototype._editItemDone = function(id, title, date) {

  };

  View.prototype._showNewNote = function() {

  };

  View.prototype._hideNewNote = function() {

  };

  View.prototype.render = function(viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      showCalendar: function() {

      },
      showCalendarEntries: function() {

      },
      showDayNotes: function() {

      },
      showSelectedDay: function() {

      },
      updateCount: function() {

      },
      removeItem: function() {

      },
      editItem: function() {

      },
      editItemDone: function() {

      }
    };

    viewCommands[viewCmd]();
  };

  View.prototype._itemId = function(element) {

  };

  View.prototype._bindItemEditDone = function (handler) {

  };

  View.prototype._bindItemEditCancel = function (handler) {

  };

  View.prototype.bind = function (event, handler) {

  };

  window.app = window.app || {};
  window.app.View = View;
}(window));
(function(window) {
  "use strict";
}(window));

(function () {

}());