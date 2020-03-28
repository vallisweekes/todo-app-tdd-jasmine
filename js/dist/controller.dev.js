"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function (window) {
  'use strict';
  /**
   * Takes a model and view and acts as the controller between them
   *
   * @constructor
   * @param {object} model The model instance
   * @param {object} view The view instance
   */

  var Controller =
  /*#__PURE__*/
  function () {
    function Controller(model, view) {
      var _this = this;

      _classCallCheck(this, Controller);

      // var self = this;
      this.model = model;
      this.view = view;
      this.view.bind('newTodo', function (title) {
        _this.addItem(title);
      });
      this.view.bind('itemEdit', function (item) {
        _this.editItem(item.id);
      });
      this.view.bind('itemEditDone', function (item) {
        _this.editItemSave(item.id, item.title);
      });
      this.view.bind('itemEditCancel', function (item) {
        _this.editItemCancel(item.id);
      });
      this.view.bind('itemRemove', function (item) {
        _this.removeItem(item.id);
      });
      this.view.bind('itemToggle', function (item) {
        _this.toggleComplete(item.id, item.completed);
      });
      this.view.bind('removeCompleted', function () {
        _this.removeCompletedItems();
      });
      this.view.bind('toggleAll', function (status) {
        _this.toggleAll(status.completed);
      });
    }
    /**
     * Loads and initialises the view
     *
     * @param {string} '' | 'active' | 'completed'
     */


    _createClass(Controller, [{
      key: "setView",
      value: function setView(locationHash) {
        var route = locationHash.split('/')[1];
        var page = route || '';

        this._updateFilterState(page);
      }
      /**
       * An event to fire on load. Will get all items and display them in the
       * todo-list
       */

    }, {
      key: "showAll",
      value: function showAll() {
        var _this2 = this;

        // var self = this;
        this.model.read(function (data) {
          // debugger;
          _this2.view.render('showEntries', data); // console.log('Checking', data);

        });
      }
      /**
       * Renders all active tasks
       */

    }, {
      key: "showActive",
      value: function showActive() {
        var _this3 = this;

        // var self = this;
        this.model.read({
          completed: false
        }, function (data) {
          _this3.view.render('showEntries', data);
        });
      }
      /**
       * Renders all completed tasks
       */

    }, {
      key: "showCompleted",
      value: function showCompleted() {
        var _this4 = this;

        // var self = this;
        this.model.read({
          completed: true
        }, function (data) {
          console.log(_this4);

          _this4.view.render('showEntries', data);
        });
      }
      /**
       * An event to fire whenever you want to add an item. Simply pass in the event
       * object and it'll handle the DOM insertion and saving of the new item.
       */

    }, {
      key: "addItem",
      value: function addItem(title) {
        var _this5 = this;

        // var self = this;
        console.log('this keyword inside additem', this);

        if (title.trim() === '') {
          return;
        }

        this.model.create(title, function () {
          console.log('this keyword inside create model', _this5);

          _this5.view.render('clearNewTodo');

          _this5._filter(true);
        });
      }
      /*
       * Triggers the item editing mode.
       */

    }, {
      key: "editItem",
      value: function editItem(id) {
        var _this6 = this;

        // var self = this;
        console.log('This inside edit item', this);
        this.model.read(id, function (data) {
          _this6.view.render('editItem', {
            id: id,
            title: data[0].title
          });
        });
      }
      /*
       * Finishes the item editing mode successfully.
       */

    }, {
      key: "editItemSave",
      value: function editItemSave(id, title) {
        var _this7 = this;

        // var self = this;
        while (title[0] === ' ') {
          title = title.slice(1);
        }

        while (title[title.length - 1] === ' ') {
          title = title.slice(0, -1);
        }

        if (title.length !== 0) {
          this.model.update(id, {
            title: title
          }, function () {
            _this7.view.render('editItemDone', {
              id: id,
              title: title
            });
          });
        } else {
          this.removeItem(id);
        }
      }
      /*
       * Cancels the item editing mode.
       */

    }, {
      key: "editItemCancel",
      value: function editItemCancel(id) {
        // var self = this;
        this.model.read(id, function (data) {
          this.view.render('editItemDone', {
            id: id,
            title: data[0].title
          });
        });
      }
      /**
       * By giving it an ID it'll find the DOM element matching that ID,
       * remove it from the DOM and also remove it from storage.
       *
       * @param {number} id The ID of the item to remove from the DOM and
       * storage
       */

    }, {
      key: "removeItem",
      value: function removeItem(id) {
        var _this8 = this;

        // var self = this;
        var items;
        this.model.read(function (data) {
          items = data;
        });
        items.forEach(function (item) {
          if (item.id === id) {
            console.log('Element with ID: ' + id + ' has been removed.');
          }
        });
        this.model.remove(id, function () {
          _this8.view.render('removeItem', id);
        });

        this._filter();
      }
      /**
       * Will remove all completed items from the DOM and storage.
       */

    }, {
      key: "removeCompletedItems",
      value: function removeCompletedItems() {
        var _this9 = this;

        // var self = this;
        this.model.read({
          completed: true
        }, function (data) {
          data.forEach(function (item) {
            _this9.removeItem(item.id);
          });
        });

        this._filter();
      }
      /**
       * Give it an ID of a model and a checkbox and it will update the item
       * in storage based on the checkbox's state.
       *
       * @param {number} id The ID of the element to complete or uncomplete
       * @param {object} checkbox The checkbox to check the state of complete
       *                          or not
       * @param {boolean|undefined} silent Prevent re-filtering the todo items
       */

    }, {
      key: "toggleComplete",
      value: function toggleComplete(id, completed, silent) {
        var _this10 = this;

        // var self = this;
        this.model.update(id, {
          completed: completed
        }, function () {
          _this10.view.render('elementComplete', {
            id: id,
            completed: completed
          });
        });

        if (!silent) {
          this._filter();
        }
      }
      /**
       * Will toggle ALL checkboxes' on/off state and completeness of models.
       * Just pass in the event object.
       */

    }, {
      key: "toggleAll",
      value: function toggleAll(completed) {
        var _this11 = this;

        // var self = this;
        this.model.read({
          completed: !completed
        }, function (data) {
          data.forEach(function (item) {
            _this11.toggleComplete(item.id, completed, true);
          });
        });

        this._filter();
      }
      /**
       * Updates the pieces of the page which change depending on the remaining
       * number of todos.
       */

    }, {
      key: "_updateCount",
      value: function _updateCount() {
        var _this12 = this;

        // var self = this;
        this.model.getCount(function (todos) {
          _this12.view.render('updateElementCount', todos.active);

          _this12.view.render('clearCompletedButton', {
            completed: todos.completed,
            visible: todos.completed > 0
          });

          _this12.view.render('toggleAll', {
            checked: todos.completed === todos.total
          });

          _this12.view.render('contentBlockVisibility', {
            visible: todos.total > 0
          });
        });
      }
      /**
       * Re-filters the todo items, based on the active route.
       * @param {boolean|undefined} force  forces a re-painting of todo items.
       */

    }, {
      key: "_filter",
      value: function _filter(force) {
        var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1); // Update the elements on the page, which change with each completed todo


        this._updateCount(); // If the last active route isn't "All", or we're switching routes, we
        // re-create the todo item elements, calling:
        //   this.show[All|Active|Completed]();


        if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
          this['show' + activeRoute]();
        }

        this._lastActiveRoute = activeRoute;
      }
      /**
       * Simply updates the filter nav's selected states
       */

    }, {
      key: "_updateFilterState",
      value: function _updateFilterState(currentPage) {
        // Store a reference to the active route, allowing us to re-filter todo
        // items as they are marked complete or incomplete.
        this._activeRoute = currentPage;
        console.log('Checking active route', currentPage);

        if (currentPage === '') {
          this._activeRoute = 'All';
        }

        this._filter();

        this.view.render('setFilter', currentPage);
      }
    }]);

    return Controller;
  }(); // Export to window


  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);