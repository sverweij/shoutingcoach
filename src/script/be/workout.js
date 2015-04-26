/* jshint node:true */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./exercise"], function(exercise) {
    "use strict";

    function Workout (pName) {
        exercise.Exercise.call(this, pName, 0);

        this.exercises = [];

        this.reset = function () {
            this._reset();
            this.exercises.forEach(function(pExercise){
                pExercise.reset();
            });
            this.currentExerciseIndex = 0;
        };

        this.reset();

    }
    
    Workout.prototype = new exercise.Exercise();
    Workout.prototype.constructor = Workout;

    Workout.prototype.toggle = function () {
        this._toggle();
        this.exercises[this.currentExerciseIndex].toggle();
    };

    Workout.prototype.pause = function () {
        this._pause();
        this.exercises[this.currentExerciseIndex].pause();
    };

    Workout.prototype.start = function () {
        this._start();
        this.beep = true;
        this.exercises[this.currentExerciseIndex].start();
    };

    Workout.prototype.resume = function () {
        this._resume();
        this.exercises[this.currentExerciseIndex].resume();
    };

    Workout.prototype.add = function(pName, pDuration, pSound) {
        this.exercises.push(new exercise.Exercise(pName, pDuration, pSound));
        this.duration += pDuration*1000;
    };

    Workout.prototype.currentExercise = function () {
        return this.exercises[this.currentExerciseIndex];
    };

    Workout.prototype.next = function() {
        var lRetval = false;
        if (this.currentExerciseIndex < (this.exercises.length - 1)){
            this.currentExerciseIndex++;
            this.beep = true;
            lRetval = true;
        }
        return lRetval;
    };

    Workout.prototype.getState = function() {
        if (this.currentExerciseIndex >= (this.exercises.length - 1) &&
            this.exercises[this.exercises.length - 1].getState() === "done") {
            return "done";
        } else {
            return this.state;
        }
    };
        
    return { Workout: Workout };
});
/*
 This file is part of ShoutingCoach.

 ShoutingCoach is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 WordyWordy is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with WordyWordy.  If not, see <http://www.gnu.org/licenses/>.
*/
