/* jshint browser:true */
/* global require, buzz */
require(["xaja", "timeutensils", "gauges", "workout","../lib/buzz", "jquery" ],
        function(xaja, timeutensils, gauges, workout, _buzz, $) {
            "use strict";

    var REFRESHAFTERMS = 50;

    var SPACE_KEY = 32;
    var ENTER_KEY = 13;
    var ESC_KEY   = 27;
    var R_KEY     = 82;
    var S_KEY     = 83;
    var COMMA_KEY = 188;

    /* for use with logitech remote */
    var PGDN_KEY  = 34;
    var DOT_KEY   = 190;

    var soundEnabled = false;

    var myCanvas     = document.getElementById("bgcanvas");

    var circleRadius = myCanvas.height/2;
    var gaugeCoords  = {x: myCanvas.width/2, y: myCanvas.height/2};
    var gaugeColors  = {primary:"#333", secondary:"black", background:"black"};
    var exerciseGauge = new gauges.CircleGauge (myCanvas, 120000, gaugeCoords, circleRadius/1.0, gaugeColors);
    var workoutGauge = new gauges.DiskGauge (myCanvas, 60000, gaugeCoords, circleRadius/2, gaugeColors);

    var timeoutID;
    var UIEnabled = false;
    var workouts = [];
    var currentWorkout;
    var startStopButtonPressing = false;
    var resetButtonPressing = false;
    var closeSettingsButtonPressing = false;

    buzz.defaults.formats= ['ogg', 'mp3'];

    var beepSound = new buzz.sound( "audio/beep" );
    var congratSound = new buzz.sound( "audio/congrat" );


    $(document).ready(function(){
        centerEverything();
        $("#StartStop").bind({
            click : startStopOnclick
        });
        $("#Reset").bind({
            click : resetOnclick
        });
        $("#CloseSettings").bind({
            click : workoutOnclick
        });
        window.onresize = centerEverything;
        /* 
         * workaround to prevent two start stop events getting fired in short
         * succession when the startstop button is the current element
         */
        $("#StartStop").bind({
            keydown : function() {
                startStopButtonPressing = true;
            }
        });
        $("#StartStop").bind({
            keyup : function() {
                startStopButtonPressing = false;
            }
        });
        $("#Reset").bind({
            keydown : function() {
                resetButtonPressing = true;
            }
        });
        $("#Reset").bind({
            keyup : function() {
                resetButtonPressing = false;
            }
        });
        $("#CloseSettings").bind({
            keydown : function() {
                closeSettingsButtonPressing = true;
            }
        });
        $("#CloseSettings").bind({
            keyup : function() {
                closeSettingsButtonPressing = false;
            }
        });
        $("#WorkoutList").bind({
            onChange : workoutListOnchange
        });
        $("#workout").bind("click", workoutOnclick);
        $("#ToggleSound").bind("click", toggleSoundOnclick);
        $("#WorkoutList").bind("change", workoutListOnchange);
        $("body").bind({
            keydown : function(e) {
                var lKey = e.keyCode;
                // var lTarget = $(e.currentTarget);
                
                switch(lKey) {
                    case (ENTER_KEY) :
                    case (PGDN_KEY) :
                    case (SPACE_KEY) : { 
                            if (!startStopButtonPressing){
                                startStopOnclick();
                            }
                        }
                        break; 
                    case (S_KEY) : {
                            toggleSoundOnclick();
                        }
                        break;
                    case (R_KEY) : 
                    case (DOT_KEY) : 
                    case (ESC_KEY) : { 
                            if (!resetButtonPressing){
                                resetOnclick();
                            }
                        }
                        break; 
                    case (COMMA_KEY):{
                            workoutOnclick();
                        }
                        break;
                    default : {
                        break;
                    }
                }
            }
        });
        xaja.ajax("./workouts.json", parseWorkoutJSON, function(){});
        showCurrentState();
    });

    function workoutOnclick() {
        $("#settings").slideToggle("fast");
        $("#workout").slideToggle("fast");
    }

    function startStopOnclick() {
        if (UIEnabled) {
            initWorkout(currentWorkout.name, currentWorkout.duration);
            currentWorkout.toggle();
            initExercise(currentWorkout.currentExercise().name,
                    currentWorkout.currentExercise().duration);
            showCurrentState();
            refresh();
        } 
    }

    function resetOnclick() {
        if (UIEnabled) {
            currentWorkout.reset();
            initWorkout(currentWorkout.name, currentWorkout.duration);
            initExercise(currentWorkout.currentExercise().name,
                    currentWorkout.currentExercise().duration);
            showCurrentState();
            showSettingState();
            refresh();
        } 
    }

    function toggleSoundOnclick() {
        soundEnabled = !soundEnabled;
        showSettingState();
    }

    function workoutListOnchange() {
        currentWorkout = workouts[window.WorkoutList.value];
        currentWorkout.reset();
        initWorkout(currentWorkout.name, currentWorkout.duration);
        initExercise(currentWorkout.exercises[0].name,
                currentWorkout.exercises[0].duration);
        showCurrentState();
        showSettingState();
        workoutOnclick();

    }

    function parseWorkoutJSON(pEvent) {
        var x = JSON.parse(pEvent.target.response);
        
        $("#WorkoutList").empty();
        x.workouts.forEach(function(pWorkout, pWorkoutNr){
            workouts.push(new workout.Workout(pWorkout.name));
            pWorkout.exercises.forEach(function(pExercise){
                workouts[workouts.length-1].add(
                    pExercise.name,
                    pExercise.duration,
                    pExercise.sound
                );
            });
            $("#WorkoutList").append("<option value=\"" + pWorkoutNr +  "\">" +
                    workouts[workouts.length-1].name + " (" +
                    timeutensils.formatTime(workouts[workouts.length-1].duration) + ")" +
                    "</option>");

        });

        currentWorkout = workouts[0];
        enableUI();
        resetOnclick();
    }

    function enableUI(pBool){
        if (!pBool) { pBool = true; }
        UIEnabled = pBool;
    }

    function showExerciseTime(pMilliSeconds) {
        if (!pMilliSeconds) { pMilliSeconds = 0;}
        window.exercisetime.textContent = timeutensils.formatTime(pMilliSeconds);
        exerciseGauge.draw(pMilliSeconds);
    }

    function initExercise (pName, pDuration){
        window.exercisename.textContent = pName;
        exerciseGauge.setParts(pDuration);
        showExerciseTime(0);
    }

    function showWorkoutTime(pMilliSeconds) {
        if (!pMilliSeconds) { pMilliSeconds = 0;}
        window.workouttime.textContent = timeutensils.formatTime(pMilliSeconds);
        workoutGauge.draw(pMilliSeconds);
        document.title =
            "-" +
            timeutensils.formatTime(currentWorkout.timeLeft()) +
            "/ " +
            timeutensils.formatTime(currentWorkout.duration);
    }

    function initWorkout (pName, pDuration) {
        window.workoutname.textContent = pName;
        workoutGauge.setParts(pDuration);
    }

    function updateStartStopButtonState(){
        var lState = currentWorkout.getState();
        switch (lState){
            case("done"): {
                window.StartStop.value = "Restart";
                window.StartStop.className = "paused";
                document.title = "Workout";
            }
            break;
            case("running"): {
                window.StartStop.value = "Pause";
                window.StartStop.className = "running";
            }
            break;
            case("reset"): {
                window.StartStop.value = "Start";
                window.StartStop.className = "paused";
                document.title = "Workout";
            }
            break;
            case("paused"): {
                window.StartStop.value = "Resume";
                window.StartStop.className = "paused";
            }
            break;
        }
    }
    
    function playSound(){
        if (currentWorkout.beep){
            if (currentWorkout.currentExercise().sound) {
                var _customSound = new buzz.sound(
                    "audio/" + currentWorkout.currentExercise().sound,
                    {
                        autoplay: true
                    }
                );                
                _customSound.bindOnce("error", function() {
                    beepSound.play();    
                });
            } else {
                beepSound.play();
            }
            currentWorkout.beep = false;
        }
    }
    
    function showCurrentState() {
        if (currentWorkout){
            if (currentWorkout && currentWorkout.currentExercise()) {
                showExerciseTime(currentWorkout.currentExercise().timeDone());
            }
            showWorkoutTime(currentWorkout.timeDone());
            playSound();    
            updateStartStopButtonState();
        }
    }

    function showSettingState () {
        if (soundEnabled){
            window.ToggleSound.checked="soundOn";
        } else { 
            window.ToggleSound.checked=null;
        }

    }

    function refreshRunning(){
        if (currentWorkout.currentExercise().getState()!=="done"){
            showCurrentState();
            clearTimeout(timeoutID);
            timeoutID = setTimeout(refresh, REFRESHAFTERMS);
        } else {
            if (currentWorkout.next()) {
                initExercise(currentWorkout.currentExercise().name,
                        currentWorkout.currentExercise().duration);
                currentWorkout.currentExercise().start();
                showCurrentState();
                clearTimeout(timeoutID);
                timeoutID = setTimeout(refresh, REFRESHAFTERMS);
            } 
        }
        
    }
    
    function refreshDone(){
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        if (currentWorkout.getState() === "done") {
            congratSound.play();
            showCurrentState();
            currentWorkout.reset();
        }
    }
    
    function refresh() {
        if (("done" !== currentWorkout.getState()) &&
                ("running" === currentWorkout.state)) {
            refreshRunning();
        } else {
            refreshDone();
        }
    }

    function centerEverything () {
        $("#everything").css("top", (window.innerHeight - window.everything.clientHeight)/2);
        sizeCanvasToWindow(myCanvas);
    }

    function resizeGauges(pCanvas){
        var lContext = pCanvas.getContext('2d');
        
        if (lContext) {
            lContext.clearRect(0,0,myCanvas.width, myCanvas.height);
            var lCoords = {x:myCanvas.width/2, y:myCanvas.height/2};

            if (exerciseGauge) {
                exerciseGauge.setCentre(lCoords);
                exerciseGauge.setRadius(myCanvas.width/2);
            }

            if (workoutGauge) {
                workoutGauge.setCentre(lCoords);
                workoutGauge.setRadius(myCanvas.width/4);
            }
        }    
    }
    function repositionCanvas(){
        $("#bgcanvas").css("left", (window.innerWidth - window.bgcanvas.clientWidth)/2);
        $("#bgcanvas").css("top", (window.innerHeight - window.bgcanvas.clientHeight)/2);
    }
    
    function sizeCanvasToWindow(pCanvas) {
        if ($(window).width() < $(window).height()) {
            pCanvas.width  = $(window).width();
            pCanvas.height = $(window).width();
        } else {
            pCanvas.width  = $(window).height();
            pCanvas.height = $(window).height();
        }
        resizeGauges(pCanvas);
        repositionCanvas();
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
