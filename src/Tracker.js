import Storage from './Storage';

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    //Constructor runs immediately when you instantiate the class, so display calories etc
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById('limit').value = this._calorieLimit;
  }
  //Public Methods/API
  addMeal(meal) {
    //push meal obj
    this._meals.push(meal);

    //account for calories in meal obj-- total calories = total calories plus meal calories
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    //add to local storage
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);

    //render everytime you add a meal
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    //account for calories in workout -- total calories = total calories minus workout calories
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);

    //render everytime you add a workout
    this._render();
  }

  removeMeal(id) {
    //find index of the meal we want to remove w/findIndex--for each meal; where the meal.id === the id thats passed in
    const index = this._meals.findIndex((meal) => meal.id === id);
    //check to make sure its a match- w/findIndex if no math will return -1
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }
  removeWorkout(id) {
    //find index of workout we want to remove w/findIndex--for each meal; where the meal.id === the id thats passed in
    const index = this._workouts.findIndex((workout) => workout.id === id);
    //check to make sure its a match- w/findIndex if no math will return -1
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  reset() {
    //set total calories to 0
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    //display calorie limit
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  //Private Methods
  _displayCaloriesTotal() {
    const totalCaloriesElement = document.getElementById('calories-total');
    totalCaloriesElement.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const calorieLimitElement = document.getElementById('calories-limit');
    calorieLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedElement =
      document.getElementById('calories-consumed');
    //take all calories in our consumed array to get 1 value

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedElement.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedElement = document.getElementById('calories-burned');
    //take all calories in our consumed array to get 1 value
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedElement.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    //total calories from calorie limit
    const caloriesRemainingElement =
      document.getElementById('calories-remaining');

    const progressElement = document.getElementById('calorie-progress');

    const remaining = this._calorieLimit - this._totalCalories;

    caloriesRemainingElement.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressElement.classList.remove('bg-success');
      progressElement.classList.add('bg-danger');
    } else {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        'bg-light'
      );
      progressElement.classList.remove('bg-danger');
      progressElement.classList.add('bg-success');
    }
  }

  _displayCaloriesProgress() {
    const progressElement = document.getElementById('calorie-progress');
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressElement.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsElement = document.getElementById('meal-items');
    //create div
    const mealElement = document.createElement('div');
    //add 2 classes
    mealElement.classList.add('card', 'my-2');
    mealElement.setAttribute('data-id', meal.id);
    mealElement.innerHTML = `
<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
`;

    //add to DOM
    mealsElement.appendChild(mealElement);
  }
  _displayNewWorkout(workout) {
    const workoutsElement = document.getElementById('workout-items');
    //create div
    const workoutElement = document.createElement('div');
    //add 2 classes
    workoutElement.classList.add('card', 'my-2');
    workoutElement.setAttribute('data-id', workout.id);
    workoutElement.innerHTML = `
<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
`;

    //add to DOM
    workoutsElement.appendChild(workoutElement);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;
