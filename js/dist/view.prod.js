"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var o=t[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,i){return t&&_defineProperties(e.prototype,t),i&&_defineProperties(e,i),e}!function(e){var t=function(){function t(e){_classCallCheck(this,t),this.template=e,this.ENTER_KEY=13,this.ESCAPE_KEY=27,this.$todoList=qs(".todo-list"),this.$todoItemCounter=qs(".todo-count"),this.$clearCompleted=qs(".clear-completed"),this.$main=qs(".main"),this.$footer=qs(".footer"),this.$toggleAll=qs(".toggle-all"),this.$newTodo=qs(".new-todo")}return _createClass(t,[{key:"_removeItem",value:function(e){var t=qs('[data-id="'+e+'"]');t&&this.$todoList.removeChild(t)}},{key:"_clearCompletedButton",value:function(e,t){this.$clearCompleted.innerHTML=this.template.clearCompletedButton(e),this.$clearCompleted.style.display=t?"block":"none"}},{key:"_setFilter",value:function(e){qs(".filters .selected").className="",qs('.filters [href="#/'+e+'"]').className="selected"}},{key:"_elementComplete",value:function(e,t){var i=qs('[data-id="'+e+'"]');i&&(i.className=t?"completed":"",qs("input",i).checked=t)}},{key:"_editItem",value:function(e,t){var i=qs('[data-id="'+e+'"]');if(i){i.className=i.className+" editing";var o=document.createElement("input");o.className="edit",i.appendChild(o),o.focus(),o.value=t}}},{key:"_editItemDone",value:function(e,t){var i=qs('[data-id="'+e+'"]');if(i){var o=qs("input.edit",i);i.removeChild(o),i.className=i.className.replace("editing",""),qsa("label",i).forEach(function(e){e.textContent=t})}}},{key:"render",value:function(e,t){var i=this;({showEntries:function(){i.$todoList.innerHTML=i.template.show(t)},removeItem:function(){i._removeItem(t)},updateElementCount:function(){i.$todoItemCounter.innerHTML=i.template.itemCounter(t)},clearCompletedButton:function(){i._clearCompletedButton(t.completed,t.visible)},contentBlockVisibility:function(){i.$main.style.display=i.$footer.style.display=t.visible?"block":"none"},toggleAll:function(){i.$toggleAll.checked=t.checked,console.log(i.$toggleAll.checked)},setFilter:function(){i._setFilter(t)},clearNewTodo:function(){i.$newTodo.value=""},elementComplete:function(){i._elementComplete(t.id,t.completed)},editItem:function(){i._editItem(t.id,t.title)},editItemDone:function(){i._editItemDone(t.id,t.title)}})[e]()}},{key:"_itemId",value:function(e){var t=$parent(e,"li");return parseInt(t.dataset.id,10)}},{key:"_bindItemEditDone",value:function(e){var t=this;$delegate(t.$todoList,"li .edit","blur",function(){this.dataset.iscanceled||e({id:t._itemId(this),title:this.value})}),$delegate(t.$todoList,"li .edit","keypress",function(e){e.keyCode===t.ENTER_KEY&&this.blur()})}},{key:"_bindItemEditCancel",value:function(t){var i=this;$delegate(i.$todoList,"li .edit","keyup",function(e){e.keyCode===i.ESCAPE_KEY&&(this.dataset.iscanceled=!0,this.blur(),t({id:i._itemId(this)}))})}},{key:"bind",value:function(e,t){var i=this;"newTodo"===e?$on(i.$newTodo,"change",function(){t(i.$newTodo.value)}):"removeCompleted"===e?$on(i.$clearCompleted,"click",function(){t()}):"toggleAll"===e?$on(i.$toggleAll,"click",function(){t({completed:this.checked})}):"itemEdit"===e?$delegate(i.$todoList,"li label","dblclick",function(){t({id:i._itemId(this)})}):"itemRemove"===e?$delegate(i.$todoList,".destroy","click",function(){t({id:i._itemId(this)})}):"itemToggle"===e?$delegate(i.$todoList,".toggle","click",function(){t({id:i._itemId(this),completed:this.checked})}):"itemEditDone"===e?i._bindItemEditDone(t):"itemEditCancel"===e&&i._bindItemEditCancel(t)}}]),t}();e.app=e.app||{},e.app.View=t}(window);