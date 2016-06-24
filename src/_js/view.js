(function(window) {
  "use strict";

  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.$calendar = qs('.calendar-main');
    this.$calendarDay = qs('.calendar-notes');
    this.$calendarTitle = qs('.calendar-main__title');
    this.$noteList = qs('.notes-list');
    this.$countList = qs('.count-list');
    this.$newNoteBlock = qs('.new-note');
    this.$noteTitle = qs('#note-title');
    this.$noteDate = qs('#note-date');
    this.$addNote = qs('.add-note');
    this.$addButton = qs('.add_note');
  }

  View.prototype._removeItem = function(id) {
    var element = qs('[data-id="' + id + '"]');

    if (element) {
      this.$noteList.removeChild(element);
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
    this.$newNoteBlock.classList.add("hidden");
  };

  View.prototype._hideNewNote = function() {
    this.$newNoteBlock.classList.remove("hidden");
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
          = "<div class='calendar__wrap'>"
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
          table += "<div class='col unactive' data-date='" + d.getFullYear() + d.getMonth() + d.getDate() + "'>" + d.getDate() + "</div>";
          d.setDate(d.getDate() + 1);
        }

        while (d.getMonth() == mon) {
          table += "<div class='col' data-date='" + d.getFullYear() + d.getMonth() + d.getDate() + "'>" + d.getDate() + "</div>";

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
        self.$calendar.innerHTML += table;

      },

      showEntries: function() {
        for (var i = 0; i < parameter.length; i++) {
          var date = "";
          date = String(parameter[i].year) + String(parameter[i].month) + String(parameter[i].day);
          var $col = qs('[data-date="' + date + '"]');;
          $col.className += ' contain';
        }
      },

      showDayNotes: function() {
        self.$noteList.innerHTML = self.template.showNotes(parameter);
      },

      showSelectedDay: function() {
        self.$calendarDay.classList.remove('hidden');
      },

      updateCount: function() {
        self.$countList.innerHTML = self.template.showCounter(parameter);
      },

      removeItem: function() {
        self._removeItem(parameter);
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