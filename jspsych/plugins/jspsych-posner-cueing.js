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
      detectedKey: {
        type: jsPsych.plugins.parameterType.INT,
        default: 32
      },
      cue_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: 50
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

    var targets = {
      0: "left",
      1: "right"
    };

    var timing = {
      // all in ms
      cue_visible: 50,
      cue_off_target_on_intervall: 600
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

    var draw = function(stim) {
      center.innerHTML = "<img class='center' src='jspsych/img_"+stim+".png'></img>"
    }

    draw(targets[1]);

    console.log(trial.cue_duration);

    jsPsych.pluginAPI.setTimeout(function() {
      end_trial();
    }, trial.cue_duration);

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
