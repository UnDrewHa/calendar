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
    this.$noteForm = qs('#noteForm');
    this.$noteTitle = qs('#note-title');
    this.$noteId = qs('#note-id');
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

  View.prototype._showNewNote = function(data) {
    this.$newNoteBlock.classList.remove("hidden");
    if (data) {
      this.$noteId.value = data.id;
      this.$noteDateY.value = data.year;
      this.$noteDateM.value = data.month;
      this.$noteDateD.value = data.day;
      this.$noteTime.value = data.time;
      this.$noteTitle.value = data.title;
    }
  };

  View.prototype._hideNewNote = function() {
    this.$newNoteBlock.classList.add("hidden");
  };

  View.prototype._clearAddingBlock = function() {
    this.$noteForm.reset();
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
          var todayDay = '' + d.getDate() + '-' + d.getMonth() + '-' + d.getYear();
          var todayDay2 = '' + new Date().getDate() + '-' + new Date().getMonth() + '-' + new Date().getYear();

          var id = todayDay === todayDay2 ? 'today' : '';
          table += "<div id='{{id}}' class='col' data-date='" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "'>" + d.getDate() + "</div>";

          if (self._getDay(d) % 7 == 6) {
            table += "</div><div class='row'>";
          }
          table = table.replace('{{id}}', id);
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
      $delegate(self.$noteList, '.edit-btn', 'click', function(e) {
        var parent = $parent(e.target, 'li'),
          data = {},
          time = qs('.item__date', parent),
          title = qs('.item__title', parent);
        data.id = parent.dataset.id;
        data.year = parent.dataset.year;
        data.month = parent.dataset.month;
        data.day = parent.dataset.day;
        data.time = time.innerHTML;
        data.title = title.innerHTML;
        self._showNewNote(data);
      });
      $on(self.$addNote, 'click', function() {
        var time = self.$noteTime.value,
            n = time.indexOf(':');
        console.log(time.slice(0, n));
        console.log(time.slice(n+1, time.length));
        handler({
          id: +self.$noteId.value,
          title: self.$noteTitle.value,
          year: +self.$noteDateY.value,
          month: +self.$noteDateM.value,
          day: +self.$noteDateD.value,
          hours: +time.slice(0, n),
          minutes: +time.slice(n+1, time.length),
          completed: 0
        });
        self._clearAddingBlock();
      });
    }
  };

  window.app = window.app || {};
  window.app.View = View;
}(window));