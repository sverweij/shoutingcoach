/* jshint browser:true */
/* global define, buzz */
define(["../be/timeutensils", "gauges", "../be/workout","../../lib/buzz", "jquery" ],
        function(timeutensils, gauges, workout, _buzz, $) {
            "use strict";

    var REFRESHAFTERMS = 50;

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

    buzz.defaults.formats= ['ogg', 'mp3'];

    var beepSound = new buzz.sound( "audio/beep" );
    var congratSound = new buzz.sound( "audio/congrat" );

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
            refresh();
        } 
    }

    function workoutListOnchange() {
        currentWorkout = workouts[window.WorkoutList.value];
        currentWorkout.reset();
        initWorkout(currentWorkout.name, currentWorkout.duration);
        initExercise(currentWorkout.exercises[0].name,
                currentWorkout.exercises[0].duration);
        showCurrentState();
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
        window.exercisetime.textContent = timeutensils.formatTime(pMilliSeconds);
        exerciseGauge.draw(pMilliSeconds);
    }

    function initExercise (pName, pDuration){
        window.exercisename.textContent = pName;
        exerciseGauge.setParts(pDuration);
        showExerciseTime(0);
    }

    function showWorkoutTime(pMilliSeconds) {
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
                var customSound = new buzz.sound(
                    "audio/" + currentWorkout.currentExercise().sound,
                    {
                        autoplay: true
                    }
                );                
                customSound.bindOnce("error", function() {
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
        $("#bgcanvas").css("left", (window.innerWidth - myCanvas.width)/2);
        $("#bgcanvas").css("top", (window.innerHeight - myCanvas.height)/2);
    }
    
    function sizeCanvasToWindow(pCanvas) {
        if (window.innerWidth < window.innerHeight) {
            pCanvas.width  = window.innerWidth;
            pCanvas.height = window.innerWidth;
        } else {
            pCanvas.width  = window.innerHeight;
            pCanvas.height = window.innerHeight;
        }
        resizeGauges(pCanvas);
        repositionCanvas();
    }

    return {
        centerEverything: centerEverything,
        startStopOnclick: startStopOnclick,
        resetOnclick: resetOnclick,
        workoutOnclick: workoutOnclick,
        workoutListOnchange: workoutListOnchange,
        parseWorkoutJSON: parseWorkoutJSON,
        showCurrentState: showCurrentState
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
