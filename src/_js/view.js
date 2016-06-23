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