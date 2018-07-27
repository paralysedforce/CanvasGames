#!/bin/bash

LOWERCASE=$(echo $1 | awk '{ print tolower($0) }')
mkdir $1
cp Templates/canvas_template.html $1/$LOWERCASE.html
cp Templates/canvas_template.js $1/$LOWERCASE.js
