var assert = require("assert");
var ex = require("../be/exercise");

describe('exercise', function() {
    var lExercise = {};
    before(function(){
        lExercise = new ex.Exercise("test exercise", 10, "asound.ogg");
    });
    
    describe('#constructor', function() {
        beforeEach(function(){
            lExercise.reset();
        });
        it("after construction status equals 'reset'", function() {            
            assert.equal(lExercise.getState(), "reset");
        });
        it("after construction time left equals 10s", function() {            
            assert.equal(lExercise.timeLeft() > 9000, true);
        });
        it("after construction no time is done", function() {            
            assert.equal(lExercise.timeDone(), 0);
        });
    });
    
    describe('#states from reset to something else', function(){
        beforeEach(function(){
            lExercise.reset();
        });        
        it("after starting, status equals 'running'", function(){
            lExercise.start();
            assert.equal(lExercise.getState(), "running");
        });
        it("after pausing, status equals 'paused'", function(){
            lExercise.pause();
            assert.equal(lExercise.getState(), "paused");
        });
        it("toggling after initalization => status equals 'running'", function(){
            lExercise.toggle();
            assert.equal(lExercise.getState(), "running");
        });
        it("after reset, reset resets to status 'reset'", function(){
            lExercise.reset();
            assert.equal(lExercise.getState(), "reset");
        });
    });
    
    describe('#states from running to something else', function(){
        beforeEach(function(){
            lExercise.start();
        });
        it("start - start => 'running'", function(){
            lExercise.start();
            assert.equal(lExercise.getState(), "running");
        });
        it("start - pause => 'paused'", function(){
            lExercise.pause();
            assert.equal(lExercise.getState(), "paused");
        });
        it("start - toggle => 'paused'", function(){
            lExercise.toggle();
            assert.equal(lExercise.getState(), "paused");
        });
    });
    
    describe('#states from paused to something else', function(){
        beforeEach(function(){
            lExercise.pause();
        });
        it("pause - start => 'running'", function(){
            lExercise.start();
            assert.equal(lExercise.getState(), "running");
        });
        it("pause - pause => 'paused'", function(){
            lExercise.pause();
            assert.equal(lExercise.getState(), "paused");
        });
        it("pause - toggle => 'running'", function(){
            lExercise.toggle();
            assert.equal(lExercise.getState(), "running");
        });
    });
    
    describe('#run down', function(){
        it("runs down!", function(){
            var lExercise = new ex.Exercise("test exercise", 0, "asound.ogg");
            assert.equal(lExercise.getState(), "done");
        });
    });
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
