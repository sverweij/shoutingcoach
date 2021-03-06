/* jshint browser:true */
/* global define */
define(["./circle"], function(circle) {
    "use strict";

    function DiskGauge (pCanvas, pParts, pCoords, pRadius, pColors) {
        this.parts           = pParts;
        this.context         = pCanvas.getContext('2d');
        this.coordinates     = pCoords;
        this.radius          = pRadius/2;
        this.lineWidth       = 2*this.radius;
        this.colors          = pColors;
    }

    DiskGauge.prototype.setParts = circle.CircleGauge.prototype.setParts;

    DiskGauge.prototype.setCentre = circle.CircleGauge.prototype.setCentre;

    DiskGauge.prototype.setRadius = function (pRadius) {
        this.radius = pRadius/2;
        this.lineWidth = 2*this.radius;
    };


    DiskGauge.prototype.draw = function (pPart) {
        var STARTANGLE  = 1.5*Math.PI;
        var CLOCKWISE   = false;

        if (pPart === 0) {
            pPart = this.parts;
        }

        var lEndAngle   = STARTANGLE + pPart*((2*Math.PI)/this.parts);

        /* hack to prevent dirty lines */
        this.context.beginPath();
        this.context.arc (this.coordinates.x, this.coordinates.y, this.radius, 0, 2*Math.PI, CLOCKWISE);
        this.context.strokeStyle = this.colors.background;
        this.context.lineWidth = this.lineWidth + 1;
        this.context.stroke();
        this.context.closePath();


        /* begin new stuff */
        this.context.beginPath();
        this.context.arc (this.coordinates.x, this.coordinates.y, this.radius, STARTANGLE, lEndAngle, CLOCKWISE);
        this.context.strokeStyle = this.colors.primary;
        this.context.lineWidth = this.lineWidth;
        this.context.stroke();
        this.context.closePath();
        /* end new stuff */

        this.context.beginPath();
        this.context.arc(this.coordinates.x, this.coordinates.y, this.radius, lEndAngle, STARTANGLE, CLOCKWISE);
        this.context.strokeStyle = this.colors.secondary;
        this.context.lineWidth = this.lineWidth;
        this.context.stroke();
        this.context.closePath();
    };
    
    return { DiskGauge: DiskGauge };
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
