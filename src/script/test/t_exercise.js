var assert = require("assert");
var ex = require("../be/exercise");

describe('exercise', function() {
    describe('#construction', function() {
        it("should initiate an workout with status 'reset'", function() {
            var lExercise = new ex.Exercise("test exercise");
            assert.equal(lExercise.getState(), "reset");
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
