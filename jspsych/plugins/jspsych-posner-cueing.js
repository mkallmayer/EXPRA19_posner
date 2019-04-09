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
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = ''; // clear the screen

    var stims = {
      left: new Image(),
      right: new Image(),
      cent: new Image()
    };

    stims.left.src = 'jspsych/img_left.png';
    stims.right.src = 'jspsych/img_right.png';
    stims.cent.src = 'jspsych/img_cent.png';
    stims.left.alt = 'alt';
    stims.right.alt = 'alt';
    stims.cent.alt = 'alt';

    var timing = {
      // all in ms
      cue_onset: 1000,
      cue_visible: 50,
      cue_off_target_on_intervall: 600
    };

    var positions = {
      // all in px
      left_x: window.innerWidth / 5,
      mid_x: window.innerWidth / 2,
      right_x: window.innerWidth - (window.innerWidth / 5),
      y: window.innerHeight / 2
    };

    // body (background)
    var body = document.getElementsByClassName("jspsych-display-element")[0];
    //body.style.backgroundColor = "grey";

    // canvas
    var canvas = document.createElement("canvas");
    display_element.appendChild(canvas);
    canvas.width = 0.95 * window.innerWidth; // no-scrollbar workaround
    canvas.height = 0.95 * window.innerHeight; // no-scrollbar workaround

    // context
    var ctx = canvas.getContext("2d");

    // draw fixation cross
    ctx.font = "50pt Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    var draw = function(img, x, y) {
      display_element.innerHTML = "<img class='jspsych-same-different-stimulus' src='jspsych/img_left.png'></img>"
    }

    console.log(stims.left);

    draw("abc", 100, 100);

    // data saving
    var trial_data = {
      rt: -1
    };

    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
