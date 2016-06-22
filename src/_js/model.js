(function(window) {
  "use strict";

  function Model(storage) {
    this.storage = storage;
  }

  Model.prototype.create = function(title, callback) {

  };

  Model.prototype.find = function(query, callback) {

  };

  Model.prototype.update = function(data, callback, id) {

  };

  Model.prototype.remove = function(id, callback) {

  };

  Model.prototype.removeAll = function(callback) {

  };

  Model.prototype.getCount = function(callback) {

  };

  window.app = window.app || {};
  window.app.Model = Model;
}(window));