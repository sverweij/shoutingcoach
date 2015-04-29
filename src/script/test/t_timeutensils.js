var assert = require("assert");
var fmt = require("../be/timeutensils");

describe('timeutensils', function() {
    describe('#formatDuration', function() {
        it('should return 00:00 for input 0', function() {
            assert.equal(fmt.formatDuration(0,false), "00:00");
        });
        it('should return 00:00 for input 0', function() {
            assert.equal(fmt.formatDuration(0,true), "00:00.0");
        });
        it('should return 00:01 for input 1000', function() {
            assert.equal(fmt.formatDuration(1000), "00:01");
        });
        it('should round to input not a mod of 1000', function() {
            assert.equal(fmt.formatDuration(800), "00:00");
        });
        it('should not round for input 800 when showing millis', function() {
            assert.equal(fmt.formatDuration(800,true), "00:00.800");
        });
        it('should round for input > 1000 that is not a mod of 1000', function() {
            assert.equal(fmt.formatDuration(1501), "00:01");
        });
        it('should not round for input > 1000 that is not a mod of 1000, when millis requested', function() {
            assert.equal(fmt.formatDuration(1501, true), "00:01.501");
        });
        it('should not add a 0 for seconds/ minutes > 10', function(){
            assert.equal(fmt.formatDuration(659000), "10:59");
        });
        it('should display non-0-padded hours for input > 36000000 ', function() {
            assert.equal(fmt.formatDuration(3660481), "1:01:00");
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
