import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import Sortable from 'sortablejs';

export default class TypesModulesListComponent extends Component {
  @service type;
  @service colormodes;
  @service module;
  @service store;
  @service types;

  @tracked activateReordering = false;

  @action
  initDragDrop() {

    var sortable = new Sortable(document.querySelector('#module-names'), {
      group: "module-names",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
      sort: true,  // sorting inside list
      delay: 0, // time in milliseconds to define when the sorting should start
      delayOnTouchOnly: false, // only delay if user is using touch
      touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
      disabled: false, // Disables the sortable if set to true.
      store: null,  // @see Store
      animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
      easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
      handle: ".drag-icon",  // Drag handle selector within list items
      filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
      preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
      draggable: ".module-name-btn",  // Specifies which items inside the element should be draggable

      dataIdAttr: 'data-module-slug', // HTML attribute that is used by the `toArray()` method

      ghostClass: "sortable-ghost",  // Class name for the drop placeholder
      chosenClass: "sortable-chosen",  // Class name for the chosen item
      dragClass: "sortable-drag",  // Class name for the dragging item

      swapThreshold: 1, // Threshold of the swap zone
      invertSwap: false, // Will always use inverted swap zone if set to true
      invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
      direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)

      forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

      fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
      fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
      fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

      dragoverBubble: false,
      removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
      emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it

      // Element dragging ended
      onEnd: async (evt)=>{
        let slug = this.type.currentType.slug;
        let modules = this.types.json.modules[slug].modules;
        modules = await array_move(modules, evt.oldIndex, evt.newIndex);
        this.types.json.modules[slug].modules = await modules;

        this.activateReordering = true;

        function array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        };
      },
    });
  }

  @action
  async ignoreReordering() {
    this.activateReordering = false;
    this.types.json = await this.store.findRecord('webapp', 0, {
      include: ['total_objects'],
    });
    this.types.json = this.types.json;
    let t = this.type.currentType;
    this.type.currentType = null;
    later(this, async ()=>{
      this.type.currentType = t;
    }, 500);
  }

  @action
  async saveReordering() {    
    await this.types.json.save();
    this.types.json = await this.store.findRecord('webapp', 0, {
      include: ['total_objects'],
    });
    this.types.json = this.types.json;
    let t = this.type.currentType;
    this.type.currentType = null;
    later(this, async ()=>{
      this.type.currentType = t;
    }, 500);
  }
}
