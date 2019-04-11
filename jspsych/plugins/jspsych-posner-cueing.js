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

    var stim_size = {
      // edit this if cue+stim size
      width: 80,
      height: 80
    };

    var cue_files = {
      0: "img_left.png",
      1: "img_right.png",
      2: "img_cent.png"
    };

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
      // clear everything
      for (i in [0, 1, 2]) {
        divs[i].innerHTML = "";
      }

      // saving data
      var trial_data = {
        rt: info.rt
      };

      // end trial after short timeout
      jsPsych.pluginAPI.setTimeout(function() {
        jsPsych.finishTrial(trial_data);
      }, 500);
    }

    var wait_drawTarget = function() {
      // draws target after time period set in timing.cue_off_target_on_interval and starts watching for keyboard response
      jsPsych.pluginAPI.setTimeout(function() {
        divs[2*trial.target_loc].innerHTML = "<img src='jspsych/target.png'></img>";
        // start response thingy
      }, trial.cue_off_target_on_interval);
    }

    var drawCue = function() {
      // draws cue and removes it after time period set in trial.cue_duration
      if (trial.condition == 0){  // valid trial: cue points to target
        cue = cue_files[trial.target_loc];
      }
      else if (trial.condition == 1){  // invalid trial: cue points away from target
        cue = cue_files[(trial.target_loc + 1) % 2];
      }
      else {  // neutral trial: neutral cue
        cue = cue_files[2];
      }
      divs[1].innerHTML = "<img src='jspsych/"+cue+"'></img>";  // draw cue

      jsPsych.pluginAPI.setTimeout(function() {
        // let trial.cue_duration time pass, then remove cue from display and wait before drawing target
        divs[1].innerHTML = "";
        wait_drawTarget();
        if (trial.choices != jsPsych.NO_KEYS) {
          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: end_trial,
            valid_responses: jsPsych.ALL_KEYS,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
          });
        }
      }, trial.cue_duration);
    }
    
    drawCue();
  
  };

  return plugin;
})();
