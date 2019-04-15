/*
 * positionsner Cueing plugin
 */

jsPsych.plugins["posner-cueing"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "posner-cueing",
    parameters: {
      condition_congruency: {
        type: jsPsych.plugins.parameterType.INT, // 0 valid 1 invalid 2 neutral
        default: undefined
      },
      condition_cuetype: {
        type: jsPsych.plugins.parameterType.INT,  // 0 arrows 1 faces
        default: undefined
      },
      target_loc: {
        type: jsPsych.plugins.parameterType.INT,  // 0 left 1 right
        default: undefined
      },
      cue_duration: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 50
      },
      target_jitter_min: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 1000
      },
      target_jitter_max: {
        type: jsPsych.plugins.parameterType.INT, // ms
        default: 2000
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var conditions_con = ["VALID", "INVALID", "NEUTRAL"];
    var conditions_cue = ["ARROW", "FACE"];
    var target_locs = ["LEFT", "RIGHT"];

    var trial_data = {
      condition: conditions_con[trial.condition_congruency],
      cue_type: conditions_cue[trial.condition_cuetype],
      target_pos: target_locs[trial.target_loc],
      cue_duration: trial.cue_duration
    }

    var stim_size = {
      // edit this if cue+stim size
      width: 80,
      height: 80
    };

    var cue_files = {
      0: "cue_left_",
      1: "cue_right_",
      2: "cue_neut_"
    };

    // use different files in face/arrow condition
    if (trial.condition_cuetype == 0) {
      var cue_suffix = "arr";
    }
    else {
      var cue_suffix = "face";
    }

    // create divs in which to draw stims in (positioning)
    var divs = {};
    factors = [1/10, 1/2, 9/10];
    for (i in [0, 1, 2]){
      divs[i] = document.createElement("div");
      divs[i].style.left = (factors[i] * window.innerWidth - stim_size.width / 2) + "px";
      divs[i].style.position = "absolute";
      divs[i].style.top = ((window.innerHeight / 2) - (stim_size.height / 2))+ "px";
      display_element.appendChild(divs[i]);
    }

    var end_trial = function (info) {
      // clear the screen
      for (i in [0, 1, 2]) {
        divs[i].innerHTML = "";
      }

      // save rt
      trial_data.rt = info.rt;

      console.log(trial_data);

      // end trial after short timeout
      jsPsych.pluginAPI.setTimeout(function() {
        jsPsych.finishTrial(trial_data);
      }, 500);
    }

    var wait_drawTarget = function() {
      var cue_target_time = Math.floor(Math.random() * (trial.target_jitter_max - trial.target_jitter_min) + trial.target_jitter_min);
      trial_data.cue_target_time = cue_target_time;  // store the time between cue offset and target onset in the data variable

      // draws target after time period set in timing.cue_off_target_on_interval and starts watching for keyboard response
      jsPsych.pluginAPI.setTimeout(function() {
        divs[2*trial.target_loc].innerHTML = "<img src='jspsych/target.png'></img>";

      // wait for response
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: end_trial,
          valid_responses: [32],
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      }, cue_target_time);
    }

    var drawCue = function() {
      // draws cue and removes it after time period set in trial.cue_duration
      if (trial.condition_congruency == 0){  // valid trial: cue points towards target
        cue = cue_files[trial.target_loc];
      }
      else if (trial.condition_congruency == 1){  // invalid trial: cue points away from target
        cue = cue_files[(trial.target_loc + 1) % 2];
      }
      else {  // neutral trial: neutral cue
        cue = cue_files[2];
      }
      divs[1].innerHTML = "<img src='jspsych/"+cue+cue_suffix+".png'></img>";  // draw cue

      jsPsych.pluginAPI.setTimeout(function() {
        // let trial.cue_duration time pass, then remove cue from display and wait before drawing target
        divs[1].innerHTML = "";
        wait_drawTarget();
      }, trial.cue_duration);
    }
    
    drawCue();
  
  };

  return plugin;
})();
