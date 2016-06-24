(function(window) {
  "use strict";

  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;
    this._date = new Date();
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

  window.app = window.app || {};
  window.app.Controller = Controller;
}(window));