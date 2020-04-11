"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*global qs, qsa, $on, $parent, $delegate */
(function (window) {
  'use strict';
  /**
   * View that abstracts away the browser's DOM completely.
   * It has two simple entry points:
   *
   *   - bind(eventName, handler)
   *     Takes a todo application event and registers the handler
   *   - render(command, parameterObject)
   *     Renders the given command with the options
   * -qs = Query selector
   */

  var View =
  /*#__PURE__*/
  function () {
    function View(template) {
      _classCallCheck(this, View);

      this.template = template;
      this.ENTER_KEY = 13;
      this.ESCAPE_KEY = 27;
      this.$todoList = qs('.todo-list');
      this.$todoItemCounter = qs('.todo-count');
      this.$clearCompleted = qs('.clear-completed');
      this.$main = qs('.main');
      this.$footer = qs('.footer');
      this.$toggleAll = qs('.toggle-all');
      this.$newTodo = qs('.new-todo');
    }

    _createClass(View, [{
      key: "_removeItem",
      value: function _removeItem(id) {
        var elem = qs('[data-id="' + id + '"]');
        if (elem) this.$todoList.removeChild(elem);
      }
    }, {
      key: "_clearCompletedButton",
      value: function _clearCompletedButton(completedCount, visible) {
        this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
        this.$clearCompleted.style.display = visible ? 'block' : 'none';
      }
    }, {
      key: "_setFilter",
      value: function _setFilter(currentPage) {
        qs('.filters .selected').className = '';
        qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
      }
    }, {
      key: "_elementComplete",
      value: function _elementComplete(id, completed) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
          return;
        }

        listItem.className = completed ? 'completed' : ''; // In case it was toggled from an event and not by clicking the checkbox

        qs('input', listItem).checked = completed;
      }
    }, {
      key: "_editItem",
      value: function _editItem(id, title) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
          return;
        }

        listItem.className = listItem.className + ' editing';
        var input = document.createElement('input');
        input.className = 'edit';
        listItem.appendChild(input);
        input.focus();
        input.value = title;
      }
    }, {
      key: "_editItemDone",
      value: function _editItemDone(id, title) {
        var listItem = qs('[data-id="' + id + '"]');

        if (!listItem) {
          return;
        }

        var input = qs('input.edit', listItem);
        listItem.removeChild(input);
        listItem.className = listItem.className.replace('editing', '');
        qsa('label', listItem).forEach(function (label) {
          label.textContent = title;
        });
      }
    }, {
      key: "render",
      value: function render(viewCmd, parameter) {
        var _this = this;

        var viewCommands = {
          showEntries: function showEntries() {
            _this.$todoList.innerHTML = _this.template.show(parameter);
          },
          removeItem: function removeItem() {
            _this._removeItem(parameter);
          },
          updateElementCount: function updateElementCount() {
            _this.$todoItemCounter.innerHTML = _this.template.itemCounter(parameter);
          },
          clearCompletedButton: function clearCompletedButton() {
            _this._clearCompletedButton(parameter.completed, parameter.visible);
          },
          contentBlockVisibility: function contentBlockVisibility() {
            _this.$main.style.display = _this.$footer.style.display = parameter.visible ? 'block' : 'none';
          },
          toggleAll: function toggleAll() {
            _this.$toggleAll.checked = parameter.checked;
            console.log(_this.$toggleAll.checked);
          },
          setFilter: function setFilter() {
            _this._setFilter(parameter);
          },
          clearNewTodo: function clearNewTodo() {
            _this.$newTodo.value = '';
          },
          elementComplete: function elementComplete() {
            _this._elementComplete(parameter.id, parameter.completed);
          },
          editItem: function editItem() {
            _this._editItem(parameter.id, parameter.title);
          },
          editItemDone: function editItemDone() {
            _this._editItemDone(parameter.id, parameter.title);
          }
        };
        viewCommands[viewCmd]();
      }
    }, {
      key: "_itemId",
      value: function _itemId(element) {
        var li = $parent(element, 'li');
        return parseInt(li.dataset.id, 10);
      }
    }, {
      key: "_bindItemEditDone",
      value: function _bindItemEditDone(handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'blur', function () {
          if (!this.dataset.iscanceled) {
            handler({
              id: self._itemId(this),
              title: this.value
            });
          }
        });
        $delegate(self.$todoList, 'li .edit', 'keypress', function (event) {
          if (event.keyCode === self.ENTER_KEY) {
            // Remove the cursor from the input when you hit enter just like if it
            // were a real form
            this.blur();
          }
        });
      }
    }, {
      key: "_bindItemEditCancel",
      value: function _bindItemEditCancel(handler) {
        var self = this;
        $delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
          if (event.keyCode === self.ESCAPE_KEY) {
            this.dataset.iscanceled = true;
            this.blur();
            handler({
              id: self._itemId(this)
            });
          }
        });
      }
    }, {
      key: "bind",
      value: function bind(event, handler) {
        var self = this;

        if (event === 'newTodo') {
          $on(self.$newTodo, 'change', function () {
            handler(self.$newTodo.value);
          });
        } else if (event === 'removeCompleted') {
          $on(self.$clearCompleted, 'click', function () {
            handler();
          });
        } else if (event === 'toggleAll') {
          $on(self.$toggleAll, 'click', function () {
            handler({
              completed: this.checked
            });
          });
        } else if (event === 'itemEdit') {
          $delegate(self.$todoList, 'li label', 'dblclick', function () {
            handler({
              id: self._itemId(this)
            });
          });
        } else if (event === 'itemRemove') {
          $delegate(self.$todoList, '.destroy', 'click', function () {
            handler({
              id: self._itemId(this)
            });
          });
        } else if (event === 'itemToggle') {
          $delegate(self.$todoList, '.toggle', 'click', function () {
            handler({
              id: self._itemId(this),
              completed: this.checked
            });
          });
        } else if (event === 'itemEditDone') {
          self._bindItemEditDone(handler);
        } else if (event === 'itemEditCancel') {
          self._bindItemEditCancel(handler);
        }
      }
    }]);

    return View;
  }(); // Export to window


  window.app = window.app || {};
  window.app.View = View; // console.log(window.app);
})(window);