/* jshint node:true */
/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    function Exercise (pName, pDuration, pSound) {
        this.name     = pName;
        this.duration = pDuration*1000;
        this.beep     = false;
        if (pSound){
            this.sound = pSound;
        }

        this.reset();
    }
    
    Exercise.prototype._reset = function (){
        this.state            = "reset"; // running, paused
        this.startTime        = Date.now();
        this.pauseStartTime   = this.startTime;
        this.cumulativePauses = 0;        
    };
    
    Exercise.prototype.reset = Exercise.prototype._reset;

    Exercise.prototype._start = function () {
        this.state             = "running";
        this.startTime         = Date.now();
        this.pauseStartTime    = this.startTime;
        this.cumulativePauses  = 0;
    };
    Exercise.prototype.start = Exercise.prototype._start;

    Exercise.prototype._resume = function () {
        this.state             = "running";
        this.cumulativePauses += Date.now() - this.pauseStartTime;
    };
    Exercise.prototype.resume = Exercise.prototype._resume;

    Exercise.prototype._pause = function () {
        if (this.state !== "paused"){
            this.state             = "paused";
            this.pauseStartTime    = Date.now();
        }
    };

    Exercise.prototype.pause = Exercise.prototype._pause;

    Exercise.prototype._toggle = function () {
        switch (this.getState()) {
            case("reset")  :  // reset -> running
            case("done")   : this.start(); break; // done -> running
            case("paused") : this.resume(); break; // paused -> running
            default        : this.pause(); break; // running/reset -> paused
        }
    };  
    Exercise.prototype.toggle = Exercise.prototype._toggle;

    Exercise.prototype.timeLeft = function () {
        return Math.max (0, this.duration - this.timeDone());
    };

    Exercise.prototype.timeDone = function (){
        return Date.now() - this.startTime - this.cumulativePauses;
    };

    Exercise.prototype.getState = function() {
        if (this.timeLeft() <= 0 ) {
            return "done";
        } else {
            return this.state;
        }
    };

    return { Exercise: Exercise };
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
