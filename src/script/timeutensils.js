/* global define */
define(function (){
    "use strict";
    // private functions
    function millisToTimeStruct (pMilliSeconds) {
        var lSeconds     = pMilliSeconds/ 1000;
        var lMinutes     = lSeconds/ 60;

        var lMilliSeconds = pMilliSeconds - (Math.floor(lSeconds)*1000);
        lSeconds     = lSeconds - (Math.floor(lMinutes) * 60);

        return {"minutes" : Math.floor(lMinutes),
                "seconds" : Math.floor(lSeconds),
                "milliseconds" : lMilliSeconds
        };
    }

    function formatTimeBlob (pInt) {
        if (pInt < 10) {
            return "0" + pInt;
        }
        return pInt.toString();
    }
    
    // private functions
    return {
        formatTime : function (pMilliSeconds, pShowMillis) {
            if (!pMilliSeconds){
                pMilliSeconds = 0;
            }
            var lTimeStruct = millisToTimeStruct(pMilliSeconds);
            if (!pShowMillis) { pShowMillis = false; }
            return formatTimeBlob (lTimeStruct.minutes) + ":" +
                   formatTimeBlob (lTimeStruct.seconds) +
                   (pShowMillis ? "." + lTimeStruct.milliseconds: "");
        }
    };
}); // define
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
