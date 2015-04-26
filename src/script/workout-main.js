/* jshint browser:true */
/* global require */
require(["painting", "xaja", "jquery" ],
        function(paint, xaja, $) {
            "use strict";

    var key2action = {
         13 : startStopKeyPress, //ENTER
         34 : startStopKeyPress, //PGDN
         32 : startStopKeyPress, //SPACE
         82 : resetKeyPress, //R
        190 : resetKeyPress, //DOT
         27 : resetKeyPress,//ESC
        188 : paint.workoutOnclick //COMMA
    };
    var startStopButtonPressing = false;
    var resetButtonPressing = false;

    $(document).ready(function(){
        paint.centerEverything();
        window.onresize = paint.centerEverything;
        /* 
         * workaround to prevent two start stop events getting fired in short
         * succession when the startstop button is the current element
         */
        $("#StartStop").bind({
            keydown : function() {
                startStopButtonPressing = true;
            },
            keyup : function() {
                startStopButtonPressing = false;
            },
            click : paint.startStopOnclick
        });
        $("#Reset").bind({
            keydown : function() {
                resetButtonPressing = true;
            },
            keyup : function() {
                resetButtonPressing = false;
            },
            click : paint.resetOnclick
        });
        $("#CloseSettings").bind({
            click : paint.workoutOnclick
        });
        $("#WorkoutList").bind({
            change : paint.workoutListOnchange,
        });
        $("#workout").bind("click", paint.workoutOnclick);
        $("body").bind({
            keydown : function(e) {
                if(key2action[e.keyCode]){
                    key2action[e.keyCode]();
                }
            }
        });
        xaja.ajax("./workouts.json", paint.parseWorkoutJSON, function(){});
        paint.showCurrentState();
    });
    
    function startStopKeyPress(){ 
        if (!startStopButtonPressing){
            paint.startStopOnclick();
        }
    }

    function resetKeyPress(){
        if (!resetButtonPressing){
            paint.resetOnclick();
        }
    }
}); // require
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
