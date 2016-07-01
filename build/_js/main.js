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
          notes: [
            { id: 1238,
              title: 'Main note',
              year: 2016,
              month: 5,
              day: 13,
              hours: 15,
              minutes: 30,
              completed: 0
            },
            { id: 1248,
              title: 'Купить порошок',
              year: 2016,
              month: 5,
              day: 13,
              hours: 15,
              minutes: 10,
              completed: 0
            },
            { id: 7865,
              title: 'Another test note',
              year: 2016,
              month: 5,
              day: 20,
              hours: 10,
              minutes: 45,
              completed: 1
            },
            { id: 346,
              title: 'Test note',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 0
            },
            { id: 897954,
              title: 'Прочитать книгу',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 0
            },
            { id: 681,
              title: 'Купить слона',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 1
            },
            { id: 991234,
              title: 'Починить велосипед',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 0
            },
            { id: 85314,
              title: 'Сходить в магазин',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 0
            },
            { id: 77964,
              title: 'Посмотреть сериал',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 1
            },

            { id: 134679,
              title: 'Съесть торт',
              year: 2016,
              month: 6,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 0
            },
            { id: 3467,
              title: 'Test note',
              year: 2016,
              month: 6,
              day: 3,
              hours: 12,
              minutes: 12,
              completed: 1
            }
          ]
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
        localStorage[this._dbname] = JSON.stringify(data);
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

  Model.prototype.create = function(data, callback) {
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
(function(window) {
  "use strict";

  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;


    this.$calendar = qs('.calendar-main');
    this.$calendarDay = qs('.calendar-notes');
    this.$calendarDayTitle = qs('.calendar-notes__date');
    this.$calendarWrap = qs('.calendar__wrap');
    this.$calendarTitle = qs('.calendar-main__title');
    this.$noteList = qs('.notes-list');
    this.$countList = qs('.count-list');
    this.$newNoteBlock = qs('.new-note');
    this.$noteTitle = qs('#note-title');
    this.$noteDateY = qs('#date-y');
    this.$noteDateM = qs('#date-m');
    this.$noteDateD = qs('#date-d');
    this.$noteTime = qs('#note-time');
    this.$addNote = qs('.add-note');
    this.$closeNote = qs('.new-note__close');
    this.$addButton = qs('.add_note');
  }

  View.prototype._removeItem = function(id) {
    var element = qs('[data-id="' + id + '"]');

    if (element) {
      this.$noteList.removeChild(element);
    }
  };
  View.prototype._toggleItem = function(item) {
    var element = qs('[data-id="' + item.id + '"]');

    if (element) {
      element.classList.toggle('completed');
      qs('input', element).checked = item.completed;
    }
  };

  View.prototype._elementComplete = function(id, completed) {
    var element = qs('[data-id="' + id + '"]');

    if (!element) {
      return;
    }
    element.className += completed ? 'completed' : '';
    qs('input', element).checked = completed;
  };

  View.prototype._editItem = function(id, title, date) {

  };

  View.prototype._editItemDone = function(id, title, date) {

  };

  View.prototype._showNewNote = function() {
    this.$newNoteBlock.classList.remove("hidden");
  };

  View.prototype._hideNewNote = function() {
    this.$newNoteBlock.classList.add("hidden");
  };

  View.prototype._getDay = function(date) {
    var day = date.getDay();
    if (day === 0) day = 7;
    return day - 1;
  };

  View.prototype.render = function(viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      showCalendar: function() {
        var mon = parameter.month,
            year = parameter.year,
            d = new Date(year, mon);
        var table
        = "<div class='next-btn'></div>"
        + "<div class='prev-btn'></div>"
        + "<div class='calendar__wrap'>"
        +   "<div class='row'>"
        +     "<div class='col'>Пн</div>"
        +     "<div class='col'>Вт</div>"
        +     "<div class='col'>Ср</div>"
        +     "<div class='col'>Чт</div>"
        +     "<div class='col'>Пт</div>"
        +     "<div class='col'>Сб</div>"
        +     "<div class='col'>Вс</div>"
        +   "</div>"
        +   "<div class='row'>";


        var num = self._getDay(d);
        if (num != 0) {
          d.setDate(d.getDate() - self._getDay(d));
        }
        for (var i = 0; i < num; i++) {
          table += "<div class='col unactive' data-date='" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "'>" + d.getDate() + "</div>";
          d.setDate(d.getDate() + 1);
        }

        while (d.getMonth() == mon) {
          table += "<div class='col' data-date='" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "'>" + d.getDate() + "</div>";

          if (self._getDay(d) % 7 == 6) {
            table += "</div><div class='row'>";
          }

          d.setDate(d.getDate() + 1);
        }
        if (self._getDay(d) != 0) {
          for (var k = self._getDay(d); k < 7; k++) {
            table += "<div class='col unactive'  data-date='" + d.getFullYear() + d.getMonth() + d.getDate() + "'>" + d.getDate() + "</div>";
            d.setDate(d.getDate() + 1);
          }
        }
        table += "</div></div>";
        self.$calendarTitle.innerHTML = self.template.showMonth(mon, year);
        self.$calendar.innerHTML = table;
      },

      showEntries: function() {
        for (var i = 0; i < parameter.length; i++) {
          var date = "";
          date = String(parameter[i].year) + "-" + String(parameter[i].month) + "-" + String(parameter[i].day);
          var $col = qs('[data-date="' + date + '"]');
          $col.className += ' contain';
        }
      },

      showDayNotes: function() {
        self.$noteList.innerHTML = self.template.showNotes(parameter);
        self.$calendarDay.classList.remove('hidden');
      },

      showDayTitle: function() {
        var day = parameter.day,
            month = parameter.month,
            dayName = parameter.dayName;
        self.$calendarDayTitle.innerHTML = self.template.showDay(day, month, dayName);
      },

      updateCount: function() {
        self.$countList.innerHTML = self.template.showCounter(parameter);
      },

      removeItem: function() {
        self._removeItem(parameter);
      },

      toggleItem: function() {
        self._toggleItem(parameter);
      },
      addNote: function() {
        self._hideNewNote();
      },


      editItem: function() {

      },

      editItemDone: function() {

      }
    };

    viewCommands[viewCmd]();
  };

  View.prototype._itemId = function(element) {
    var li = $parent(element, 'li');
    return parseInt(li.dataset.id, 10);
  };

  View.prototype._bindItemEditDone = function (handler) {

  };

  View.prototype._bindItemEditCancel = function (handler) {

  };

  View.prototype.bind = function (event, handler) {
    var self = this;
    if (event === 'nextMonth') {
      $delegate(self.$calendar, '.next-btn', 'click', function() {
        handler();
      });
    }
    else if (event === 'prevMonth') {
      $delegate(self.$calendar, '.prev-btn', 'click', function() {
        handler();
      });
    }
    else if (event === 'showDayNotes') {
      $delegate(self.$calendar, '.col', 'click', function() {
        var el = this;
        if (!el.classList.contains('contain')) {
          return;
        }
        handler(el.dataset.date);
      });
    }
    else if (event === 'removeItem') {
      $delegate(self.$noteList, '.destroy-btn', 'click', function() {
        handler(self._itemId(this));
      });
    }
    else if (event === 'toggleItem') {
      $delegate(self.$noteList, '.toggle', 'click', function() {
        console.log(self._itemId(this));
        console.log(this.checked);
        handler({id: self._itemId(this), completed: this.checked});
      });
    }
    else if (event === 'addNote') {
      $on(self.$addButton, 'click', function() {
        self._showNewNote();
      });
      $on(self.$closeNote, 'click', function() {
        self._hideNewNote();
        return;
      });
      $on(self.$addNote, 'click', function() {
        var time = self.$noteTime.value,
            n = time.indexOf(':');
        console.log(time.slice(0, n));
        console.log(time.slice(n+1, time.length));
        handler({
          title: self.$noteTitle.value,
          year: +self.$noteDateY.value,
          month: +self.$noteDateM.value,
          day: +self.$noteDateD.value,
          hours: +time.slice(0, n),
          minutes: +time.slice(n+1, time.length),
          completed: 0
        });
      });
    }
  };

  window.app = window.app || {};
  window.app.View = View;
}(window));
(function(window) {
  "use strict";

  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;
    this._date = new Date();

    self.view.bind('nextMonth', function () {
      self.nextMonth();
    });
    self.view.bind('prevMonth', function () {
      self.prevMonth();
    });
    self.view.bind('showDayNotes', function (date) {
      self.showDayNotes(date);
    });
    self.view.bind('removeItem', function (id) {
      self.removeItem(id);
    });
    self.view.bind('toggleItem', function (item) {
      self.toggleItem(item.id, item.completed);
    });
    self.view.bind('addNote', function (data) {
      self.addNote(data);
    });
    
  }

  Controller.prototype.startView = function() {
    var self = this;
    self.view.render('showCalendar', {year: this._date.getFullYear(), month: this._date.getMonth()});
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
    self.model.find({year: this._date.getFullYear(), month: this._date.getMonth()}, function(dots) {
      self.view.render('showEntries', dots);
    });
  };

  Controller.prototype.nextMonth = function() {
    var self = this;
    console.log(this._date);
    this._date.setMonth(this._date.getMonth() + 1);
    console.log(this._date);
    self.view.render('showCalendar', {year: this._date.getFullYear(), month: this._date.getMonth()});
    self.model.find({year: this._date.getFullYear(), month: this._date.getMonth()}, function(dots) {
      self.view.render('showEntries', dots);
    });
  };
  Controller.prototype.prevMonth = function() {
    var self = this;
    this._date.setMonth(this._date.getMonth() - 1);
    self.view.render('showCalendar', {year: this._date.getFullYear(), month: this._date.getMonth()});
    self.model.find({year: this._date.getFullYear(), month: this._date.getMonth()}, function(dots) {
      self.view.render('showEntries', dots);
    });
  };
  Controller.prototype.removeItem = function(id) {
    var self = this;
    self.model.remove(id, function() {
      self.view.render('removeItem', id);
    });
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
  };
  Controller.prototype.toggleItem = function(id, completed) {
    var self = this;
    self.model.update({completed: +completed}, function() {
      self.view.render('toggleItem', {id: +id, completed: +completed});
    }, id);
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
  };
  Controller.prototype.addNote = function(data) {
    var self = this;
    self.model.create(data, function() {
      self.view.render('addNote');
    });
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
  };
  

  Controller.prototype.showDayNotes = function(date) {
    var self = this;
    if (!date) {
      return;
    }

    var n = date.lastIndexOf("-"),
        y = date.substr(0, 4),
        m = date.slice(5, n),
        d = date.slice(n+1, date.length),
        currentDate = new Date(y,m,d);
        
    self.model.find({year: parseInt(y, 10), month: parseInt(m, 10), day: parseInt(d, 10) }, function(notes) {
      self.view.render('showDayNotes', notes);
    });
    self.view.render('showDayTitle', {day: d, month: m, dayName: currentDate.getDay()});
  };


  window.app = window.app || {};
  window.app.Controller = Controller;
}(window));

(function () {
  function Calendar(name) {
    this.storage = new app.Store(name);
    this.model = new app.Model(this.storage);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }
  
  var calendar = new Calendar('new-calendar');
  
  function setView() {
    calendar.controller.startView();
  }

  $on(window, 'load', setView);
}());