/*
 * positionsner Cueing plugin
 */

jsPsych.plugins["posner-cueing"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "posner-cueing",
    parameters: {
      condition: {
        type: jsPsych.plugins.parameterType.INT, // 0 valid 1 invalid 2 neutral
        default: undefined
      },
      target_loc: {
        type: jsPsych.plugins.parameterType.INT,  // 0 left 1 right
        default: undefined
      },
      detectedKey: {
        type: jsPsych.plugins.parameterType.INT,
        default: 32
      },
      cue_duration: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 50
      },
      cue_off_target_on_interval: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 600
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var stims = {
      width: 80,
      height: 80
    };

    var target_file = {
      0: "img_left.png",
      1: "img_right.png",
      2: "img_cent.png"
    };

    // body (background)
    var body = document.getElementsByClassName("jspsych-display-element")[0];
    //body.style.backgroundColor = "grey";

    // canvas
    var canvas = document.createElement("canvas");
    display_element.appendChild(canvas);
    canvas.width = window.innerWidth; // no-scrollbar workaround
    canvas.height = window.innerHeight; // no-scrollbar workaround

    // create divs for which to draw stims in
    var left = document.createElement("div");
    left.style.position = "absolute";
    left.style.left = ((canvas.width / 10) - (stims.width / 2))+ "px";
    left.style.top = ((canvas.height / 2) - (stims.height / 2))+ "px";
    left.style.width = stims.width + "px"
    left.style.height = stims.height + "px"
    left.style.background = "black"

    var right = document.createElement("div");
    right.style.position = "absolute";
    right.style.left = ((9 * canvas.width / 10) - (stims.width / 2))+ "px";
    right.style.top = ((canvas.height / 2) - (stims.height / 2))+ "px";
    right.style.width = stims.width + "px"
    right.style.height = stims.height + "px"
    right.style.background = "black"

    var center = document.createElement("div");
    center.style.position = "absolute";
    center.style.left = ((canvas.width / 2) - (stims.width / 2))+ "px";
    center.style.top = ((canvas.height / 2) - (stims.height / 2))+ "px";
    center.style.width = stims.width + "px"
    center.style.height = stims.height + "px"
    center.style.background = "black"

    var divs = {
      0: left,
      1: center,
      2: right
    };

    console.log(divs);

    // bind divs to body
    body.appendChild(left);
    body.appendChild(center);
    body.appendChild(right);

    // context
    var ctx = canvas.getContext("2d");

    var wait_drawTarget = function() {
      // draws target after time period set in timing.cue_off_target_on_interval and starts watching for keyboard response
      
      jsPsych.pluginAPI.setTimeout(function() {
        divs[2*trial.target_loc].innerHTML = "<img src='jspsych/target.png'></img>";
        // start response thingy
      }, trial.cue_off_target_on_interval);
    }

    var drawCue = function() {
      // draws cue and removes it after time period set in trial.cue_duration
      if (trial.condition == 0){
        stim_file = target_file[trial.target_loc];
      }
      else if (trial.condition == 1){
        stim_file = target_file[(trial.target_loc + 1) % 2];
      }
      else {
        stim_file = target_file[2];
      }

      center.innerHTML = "<img src='jspsych/"+stim_file+"'></img>";

      jsPsych.pluginAPI.setTimeout(function() {
        center.innerHTML = "";
        wait_drawTarget();
      }, trial.cue_duration);
    }
    
    drawCue();

    // data saving
    var trial_data = {
      rt: -1
    };

    var end_trial = function(){
      // clear everything
      for (i in [0, 1, 2]){
        divs[i].innerHTML = "";
      }

      // end trial
      jsPsych.finishTrial(trial_data);
    };
  
  };

  return plugin;
})();
