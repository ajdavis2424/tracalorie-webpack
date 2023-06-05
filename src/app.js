import './css/bootstrap.css';
import { Modal, Collapse } from 'bootstrap';
import './css/style.css';
import '@fortawesome/fontawesome-free/js/all';

import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

// App Class to handle events
class App {
  constructor() {
    /*set tracker to property in constructor, now we can access public methods. 
    event listners will go in to the constructor as well */
    this._tracker = new CalorieTracker();
    this._loadEventListners();
    this._tracker.loadItems();
  }

  _loadEventListners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));
    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    //use event delegation to target meal-items the parent class of all the items. When we click we call
    //remove items-- need this keyword to be the actual object, so we bind and pass in this & type
    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));
    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    //filtering
    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'));
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

    //reset
    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));
    //set calorie limie
    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    //get input fields
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    //Validate inputs and make sure they're there
    if (name.value === '' || calories.value === '') {
      alert(`Please complete all fields`);
      return;
    }

    //Create a new meal or a new workout
    if (type === 'meal') {
      //+ on +calories turns string into a number
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    //clear form
    name.value = '';
    calories.value = '';

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, { toggle: true });
  }
  _removeItem(type, e) {
    //target the button
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        //get id of "item"
        const id = e.target.closest('.card').getAttribute('data-id');
        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        const item = e.target.closest('.card').remove();
      }
    }
  }
  _filterItems(type, e) {
    //get text from input
    const text = e.target.value.toLowerCase();
    //now that we have text we loop through the items
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _reset() {
    this._tracker.reset();
    //clear up any meal or workout items in DOM
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();
    //get actual limit
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please add a calorie limit');
      return;
    }
    this._tracker.setLimit(+limit.value);
    //clear limit form
    limit.value = '';

    //close bootstrap modal
    const modalElement = document.getElementById('limit-modal');
    const modal = Modal.getInstance(modalElement);
    modal.hide();
  }
}

//Runs the app
const app = new App();
