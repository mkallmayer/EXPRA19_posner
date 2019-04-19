/*
 * Posner Cueing plugin
 * This script executes a single trial of the Posner attention cueing experiment
 */

jsPsych.plugins["posner-cueing"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "posner-cueing",
    parameters: {
      condition_congruency: {
        type: jsPsych.plugins.parameterType.INT // 0 valid 1 invalid 2 neutral
      },
      condition_cuemood: {
        type: jsPsych.plugins.parameterType.INT  // 0 negative 1 positive
      },
      target_loc: {
        type: jsPsych.plugins.parameterType.INT  // 0 left 1 right
      },
      cue_duration: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 100
      },
      target_jitter_min: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 1000
      },
      target_jitter_max: {
        type: jsPsych.plugins.parameterType.INT,  // ms
        default: 2000
      },
      practice: {
        type: jsPsych.plugins.parameterType.INT,  // bool
        default: 0
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var conditions_con = ["VALID", "INVALID", "NEUTRAL"];
    var target_locs = ["LEFT", "RIGHT"];
    var cue_moods = ["NEG", "POS"];
    var cue_files = {
      0: "cue_left_",
      1: "cue_right_",
      2: "cue_neut_"
    };
    var stim_size = 160;
    var cue_suffix_mood = cue_moods[trial.condition_cuemood].toLowerCase();  // get filename suffix dependent on mood

    var trial_data = {
      condition: conditions_con[trial.condition_congruency],
      cue_mood: cue_moods[trial.condition_cuemood],
      target_pos: target_locs[trial.target_loc],
      cue_duration: trial.cue_duration,
      cue_target_time: Math.floor(Math.random() * (trial.target_jitter_max - trial.target_jitter_min) + trial.target_jitter_min),
      is_practice: trial.practice,
      rt: null
    };

    // create divs in which to draw stims in (positioning)
    var divs = {};
    factors = [1/10, 1/2, 9/10];
    for (i=0; i<=2; i++) {
      divs[i] = document.createElement("div");
      divs[i].style.position = "absolute";
      divs[i].style.left = (factors[i] * window.innerWidth - (stim_size / 2)) + "px";
      divs[i].style.top = (((window.innerHeight) / 2) - (stim_size / 2)) + "px";
      display_element.appendChild(divs[i]);
    }

    var feedback = function(rt) {
      // provide feedback to the user
      for (d in [0,1,2]){
        divs[d].innerHTML = "";
      }
      if (trial.practice == 0){
        var total = N_trials;
      } else {
        var total = N_practice;
      }
      display_element.innerHTML += rt+'<p>Trial ' + trial_number + '/' + total + '</p>';
      // increase trial count
      if (trial_number == N_practice){  // reset after practice trials
        trial_number = 1;
      } else {
        trial_number++;
      }
      // finish this trial and submit data to main experiment loop
      jsPsych.pluginAPI.setTimeout( function() { jsPsych.finishTrial(trial_data); }, 1000);
    }

    var response_after_target_onset = function(info) {
      // save rt
      trial_data.rt = info.rt;
      feedback('<p>RT: ' + Math.floor(info.rt) + 'ms</p>');
    }

    var response_before_target_onset = function(info) {
      jsPsych.pluginAPI.clearAllTimeouts();
      jsPsych.pluginAPI.cancelAllKeyboardResponses();
      // rt -1 (signify invalid response)
      trial_data.rt = -1;
      feedback('<p>You responded too early!</p>');
    }

    var wait_drawTarget = function() {
      // draws target after time period set in trial.cue_target_time and calls keyboard listener
      jsPsych.pluginAPI.setTimeout(function() {
        divs[2*trial.target_loc].innerHTML = "<img src='jspsych/target.png'></img>";
        jsPsych.pluginAPI.cancelAllKeyboardResponses();  // cancel 'too early' listener

        // wait for response
        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: response_after_target_onset,
            valid_responses: ['n'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });
      }, trial_data.cue_target_time);
    }

    var drawCue = function() {
      // draws cue and removes it after time period set in trial.cue_duration
      if (trial.condition_congruency == 0){  // valid trial: cue points towards target
        cue = cue_files[trial.target_loc];
      }
      else if (trial.condition_congruency == 1){  // invalid trial: cue points away from target
        cue = cue_files[((trial.target_loc + 1) % 2)];
      }
      else {  // neutral trial: neutral cue
        cue = cue_files[2];
      }
      divs[1].innerHTML += "<img src='jspsych/"+cue+"face_"+cue_suffix_mood+".png'></img>";  // draw cue
      
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: response_before_target_onset,
        valid_responses: ['n'],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
      
      wait_drawTarget();
    }
    drawCue();  // set the trial off
  };
  return plugin;
})();
