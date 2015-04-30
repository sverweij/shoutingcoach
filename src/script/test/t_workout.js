var assert = require("assert");
var wo = require("../be/workout");

describe('workout', function() {
    describe('#constructor', function() {

        it("should initiate a workout with status 'reset'", function() {
            var lWorkout = new wo.Workout("test workout");
            lWorkout.add("first exercise", 1);
            lWorkout.add("second exercise - with sound", 1, "withsound.ogg");
            lWorkout.add("last exercise", 1);
            lWorkout.reset();
            assert.equal(lWorkout.getState(), "reset");
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
