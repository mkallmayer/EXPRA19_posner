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

    var left = document.createElement("div");
    left.style.position = "absolute";
    left.style.left = "10%";
    left.style.top = "50%";

    var right = document.createElement("div");
    right.style.position = "absolute";
    right.style.left = "90%";
    right.style.top = "50%";

    var center = document.createElement("div");
    center.style.position = "absolute";
    center.style.left = "50%";
    center.style.top = "50%";

    var divs = {
      0: left,
      1: center,
      2: right
    }

    var target_file = {
      0: "img_left.png",
      1: "img_right.png",
      2: "img_cent.png"
    };

    // body (background)
    var body = document.getElementsByClassName("jspsych-display-element")[0];
    //body.style.backgroundColor = "grey";

    body.appendChild(left);
    body.appendChild(center);
    body.appendChild(right);

    // canvas
    var canvas = document.createElement("canvas");
    display_element.appendChild(canvas);
    canvas.width = 0.95 * window.innerWidth; // no-scrollbar workaround
    canvas.height = 0.95 * window.innerHeight; // no-scrollbar workaround

    // context
    var ctx = canvas.getContext("2d");

    var wait_drawTarget = function() {
      // draws target after time period set in timing.cue_off_target_on_interval and starts watching for keyboard response
      
      jsPsych.pluginAPI.setTimeout(function() {
        divs[2*trial.target_loc].innerHTML = "<img class='center' src='jspsych/target.png'></img>";
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

      center.innerHTML = "<img class='center' src='jspsych/"+stim_file+"'></img>";

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
