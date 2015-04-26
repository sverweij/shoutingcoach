#!/bin/sh
# (gb) serena, (ie) moira, (scot) fiona, karen, (in) sangeeta, (za) tessa, i(us)samantha, jill, kathy, vicki

function generateAudio () {
    say -v $VOICE $2 -o $1 -r140
    sox $1.aiff $OUTPUTDIR/$1.ogg
    sox $1.aiff $OUTPUTDIR/$1.mp3
    #
    # ogg and mp3 cover all browsers I want to,
    # so wav and m4a are not necessary anymore ...
    #
    # sox $1.aiff $OUTPUTDIR/$1.wav
    # afconvert --file 'm4af'  --data 'aac' $1.aiff
    # mv $1.m4a $OUTPUTDIR/.
}

function log() {
    echo ... $*
    # say -v $VOICE $*
}

function cleanupOutputDir () {
    log Cleaning up old audio files by removing folder $OUTPUTDIR and creating it again
    rm -rf $OUTPUTDIR
    mkdir $OUTPUTDIR
}

function generateStopwatchAudio (){
    log $VOICE speaking the stopwatch
    log Creating the zero and 1 minute versions ...
    generateAudio 0m15s "15 seconds"
    generateAudio 0m30s "30 seconds"
    generateAudio 0m45s "45 seconds"
    generateAudio 1m "1 minute"
    generateAudio 1m15s "1 minute and 15 seconds"
    generateAudio 1m30s "1 minute and 30 seconds"
    generateAudio 1m45s "1 minute and 45 seconds"

    log Creating the 2 minute to 15 minute versions
    log This will take a while. I will be counting up in the mean time

    for i in 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
        log $i
        generateAudio $i'm' $i' minutes'
        generateAudio $i'm15s' $i' minutes and 15 seconds'
        generateAudio $i'm30s' $i' minutes and 30 seconds'
        generateAudio $i'm45s' $i' minutes and 45 seconds'
    done
}

function generateWorkoutAudio () {
    log $VOICE speaking the workout
    generateAudio beep "Beep beep!"
    generateAudio congrat "Congratulations, you have completed the workout"

    # custom audio
    # debug exercise
    generateAudio firstexercise "First exercise"
    generateAudio secondexercise "Second exercise"
    generateAudio lastexercise "The last exercise. Go for it!"

    # sunday drill, sweat + shape, fighter fit, 7 minute workout
    generateAudio abdominalcrunches "Abdominal crunches"
    generateAudio alternatingstepbacklunges "Alternating stepback lunges"
    generateAudio arroundtheworldlunges "Arround the world lunges"
    generateAudio backpedal "Back pedal"
    generateAudio crazyivans "Crazy Ivans"
    generateAudio crossbacklunge "Cross back lunge"
    generateAudio deadlift "Deadlift"
    generateAudio dipswithlegsstraight "Dips with legs straight"
    generateAudio highkneerunsinplace "high knee runs in place"
    generateAudio hiplifts "Hip lifts"
    generateAudio jumpingjacks "Jumping jacks"
    generateAudio kneetucks "Knee tucks"
    generateAudio lightjog "Light jog"
    generateAudio lunges "lunges"
    generateAudio modifiedburpee "Modified burpee"
    generateAudio modifiedplank "Modified plank"
    generateAudio modifiedpressups "Modified press ups"
    generateAudio modifiedpushups "Modified pushups"
    generateAudio modifiedtriceppressups "Modified tricep press ups"
    generateAudio mountainclimbers "Mountain climbers"
    generateAudio oppositearmleg "Opposite arm leg extensions"
    generateAudio oppositearmlegsupermans "Opposite arm leg supermans"
    generateAudio plank "Plank"
    generateAudio pushups "Pushups"
    generateAudio pushupsandrotation "Pushups and rotation"
    generateAudio reversecrunches "Reverse crunches"
    generateAudio runinplace  "Run in place"
    generateAudio russiantwists  "Russian twists"
    generateAudio shoulderpress "Shoulder press"
    generateAudio sidelunge "Side lunge"
    generateAudio sideplank "Side plank"
    generateAudio situps "Sit ups"
    generateAudio slideandglide "Slide and glide"
    generateAudio squathold "Squat hold"
    generateAudio squatjumps "Squat jumps"
    generateAudio squats "Squats"
    generateAudio stepups "Step ups"
    generateAudio straightlegkicks "Straight leg kicks"
    generateAudio sumosquatlateralraise "Sumo squat, lateral raise"
    generateAudio tricepdips "Tricep dips"
    generateAudio twofeetforwardbackwardhop "Two feet forward-backward hop"
    generateAudio twofeetlateralhop "Two feet lateral hop"
    generateAudio walkinglunges "Walking lunges"
    generateAudio walkouts "Walk outs"
    generateAudio wallsit "Wall sit"
    
    # stretches
    generateAudio calfstretch "Calf stretches"
    generateAudio hamstring "Hamstring stretches"
    generateAudio lowerback "Lower back stretches"
    generateAudio pretzel "Pretzel stretches"
    generateAudio standinghamstring "Standing hamstring stretches"

    # generics
    generateAudio switchsides "Switch sides"
    generateAudio recover "Recover"
    generateAudio pause "Pause"
}

function generateCountdownAudio () {
    log $VOICE speaking the countdown
    generateAudio timesup "Time is up."
}

function generateMetronomeAudio () {
    log generating metronome beeps
    sox -n $OUTPUTDIR/click.ogg synth sin %12 fade h 0.0 0.1 0.1
    sox -n $OUTPUTDIR/click.mp3 synth sin %12 fade h 0.0 0.1 0.1
    sox -n $OUTPUTDIR/clack.ogg synth sin %0 fade h 0.0 0.1 0.1
    sox -n $OUTPUTDIR/clack.mp3 synth sin %0 fade h 0.0 0.1 0.1
}

AUDIOBASE=frontend/audio
# rm -rf $AUDIOBASE
# mkdir $AUDIOBASE

OUTPUTDIR=$AUDIOBASE/workoutoutput
VOICE=fiona
cleanupOutputDir
generateWorkoutAudio
mv $OUTPUTDIR/* $AUDIOBASE
rmdir $OUTPUTDIR

# OUTPUTDIR=$AUDIOBASE/countdownoutput
# VOICE=serena
# cleanupOutputDir
# generateCountdownAudio
# mv $OUTPUTDIR/* $AUDIOBASE
# rmdir $OUTPUTDIR

# OUTPUTDIR=$AUDIOBASE/stopwatchoutput
# VOICE=serena
# cleanupOutputDir
# generateStopwatchAudio
# mv $OUTPUTDIR/* $AUDIOBASE
# rmdir $OUTPUTDIR

# OUTPUTDIR=$AUDIOBASE/metronomeoutput
# VOICE=fiona
# cleanupOutputDir
# generateMetronomeAudio
# mv $OUTPUTDIR/* $AUDIOBASE
# rmdir $OUTPUTDIR

log Done generating. Cleaning up the aiffs ..
rm -f *.aiff

log Done!
