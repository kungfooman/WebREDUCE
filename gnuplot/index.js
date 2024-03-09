// WebAssembly module config
/** @type {string[]} */
var STDOUT = [];
var SCRIPT_FILE = "script.gnuplot";
var CONFIG_EDITOR = {
  mode: "ace/mode/text",
  selectionStyle: "text",
  tabSize: 2
};
var Module = {
  // Don't run main on page load
  noInitialRun: true,
  // Print functions
  print: stdout => STDOUT.push(stdout),
  printErr: stderr => STDOUT.push(stderr),
  // When the module is ready
  onRuntimeInitialized: function() {
    const l = document.getElementById("loading");
    if (l) {
      // Not used for REDUCE
      l.style.display = "none";
    }
    document.getElementById("gnuplot").style.display = "block";
    document.getElementById("load-button").disabled = false;
    document.getElementById("download-button").disabled = false;
    document.getElementById("template-select").disabled = false;
    const v = document.getElementById("version");
    if (v) {
      // Not used for REDUCE
      v.innerHTML = "Powered by " + run_gnuplot("","--version");
    }
  },
  preRun: function() {
    function stdin() {
      return null; // if gnuplot asks for input, say NO
    }
    FS.init(stdin,null,null);
  }
};
// Utility function to run gnuplot
/**
 * 
 * @param {string} script 
 * @param {string|string[]} options 
 * @returns {string}
 */
function run_gnuplot(script, options) {
  // Create file from object
  script = "set term canvas name 'draw_plot_on_canvas' size 500,400;set output 'plot.js'\n" + script;
  FS.writeFile(SCRIPT_FILE, script);
  // Clear previous stdout/stderr before launching gnuplot
  STDOUT = [];
  // Launch gnuplot's main() function
  let args = [ SCRIPT_FILE ];
  args = args.concat(options)
  // HACK: gnuplot does not clean up memory when it exits.
  // this is OK under normal circumstances because the OS will
  // reclaim the memory. But the emscripten runtime does not
  // do this, so we create a snapshot of the memory before calling
  // main and restore it after calling main.
  const mem_snapshot = Uint8Array.from(HEAPU8);
  callMain(args);
  HEAPU8.set(mem_snapshot);
  return STDOUT.join("\n");
}
// Launch gnuplot with current field values
function launch() {
  let elError = document.getElementById("error");
  let elImage = document.getElementById("gnuplot-image");
  // Write data file
  FS.writeFile("data.txt", editorData.getValue());
  // Call gnuplot
  let out = run_gnuplot(editorInput.getValue(), []);
  // Display output
  editorOutput.setValue(out, 1);
  // Display plot image
  elImage.innerHTML = "<canvas id='draw_plot_on_canvas' width=500 height=400> <div id='err_msg'>No support for HTML 5 canvas element<\/div> <\/canvas>";
  let draw_script  = FS.readFile("plot.js",{"encoding":"utf8"});
  eval(draw_script);
  if (typeof draw_plot_on_canvas == 'function') {
    draw_plot_on_canvas();
  }
  // Save script and data file 
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("script.gnuplot", editorInput.getValue());
    localStorage.setItem("data.txt", editorData.getValue());
  }
}
var typingTimer;
var typingTimeout = 500;
// On page load
document.addEventListener("DOMContentLoaded", function() {
// Setup ACE editors
let elInput  = document.getElementById("input");
let elData   = document.getElementById("data");
let elOutput = document.getElementById("output");
editorInput  = ace.edit(elInput , CONFIG_EDITOR);
editorData   = ace.edit(elData  , CONFIG_EDITOR);
editorOutput = ace.edit(elOutput, CONFIG_EDITOR);
// automatically run gnuplot when the user stops typing
document.addEventListener("keyup", function() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(launch,typingTimeout);
});
if (typeof(Storage) !== "undefined") {
  let script = localStorage.getItem("script.gnuplot");
  if (script != null) {
    editorInput.setValue(script);
    editorInput.gotoLine(1);
  }
  let data = localStorage.getItem("data.txt");
  if (script != null) {
    editorData.setValue(data);
    editorData.gotoLine(1);
  }
}
document.getElementById("download-button").addEventListener("click",
  function(){
    let elem = document.createElement("a");
    elem.href = "data:attachment/text," + encodeURIComponent(editorInput.getValue());
    elem.target = '_blank';
    elem.download = 'script.gnuplot';
    elem.click();
    elem = document.createElement("a");
    elem.href = "data:attachment/text," + encodeURIComponent(editorData.getValue());
    elem.target = '_blank';
    elem.download = 'data.txt';
    elem.click();
    // elem = document.createElement("a");
    // elem.href = "data:attachment/text," + encodeURIComponent(FS.readFile("/tmp/out.html",{"encoding":"utf8"}));
    // elem.target = '_blank';
    // elem.download = 'plot.html';
    // elem.click();
  });
// Load templates when the load button is clicked
document.getElementById("load-button").addEventListener("click",
  function() {
    let choice = document.getElementById("template-select").value;
    let script_text = "";
    let data_text = "";
    if (choice == "Function Plotting") {
      script_text += "set title 'Function Plot'\n";
      script_text += "set xlabel 'time [s]'\n";
      script_text += "set ylabel 'voltage [V]'\n";
      script_text += "set xrange[0:5]\n";
      script_text += "set yrange[-1.5:1.5]\n";
      script_text += "plot exp(-x)*sin(4*x) title 'signal', exp(-x) title 'amplitude' lt 0, -exp(-x) title '' lt 0\n";
    }
    if (choice == "Data Plotting") {
      script_text += "set title 'Data Plot'\n";
      script_text += "set xlabel 'time [min]'\n";
      script_text += "set ylabel 'distance [mile]'\n";
      script_text += "plot 'data.txt' title 'trial 1', 'data.txt' using 1:3 title 'trial 2'\n";
      data_text += "0  0.0  0.0\n";
      data_text += "5  5.5  5.7\n";
      data_text += "10 11.2 12.7\n";
      data_text += "15 16.4 17.2\n";
      data_text += "20 22.1 23.8\n";
      data_text += "25 27.8 27.4\n";
      data_text += "30 33.8 34.7\n";
      data_text += "35 38.4 39.2\n";
      data_text += "40 41.1 44.5\n";
      data_text += "45 45.8 46.8\n";
      data_text += "50 54.7 57.4\n";
      data_text += "55 59.2 59.5\n";
      data_text += "60 62.5 66.1\n";
    }
    if (choice == "Linear Regression") {
      script_text += "set title 'Data Plot'\n";
      script_text += "set xlabel 'time [min]'\n";
      script_text += "set ylabel 'distance [mile]'\n";
      script_text += "fit m*x + b 'data.txt' via m,b\n";
      script_text += "plot 'data.txt' title 'data', m*x + b title 'fit'\n";
      data_text += "0  0.0\n";
      data_text += "5  5.5\n";
      data_text += "10 11.2\n";
      data_text += "15 16.4\n";
      data_text += "20 22.1\n";
      data_text += "25 27.8\n";
      data_text += "30 33.8\n";
      data_text += "35 38.4\n";
      data_text += "40 41.1\n";
      data_text += "45 45.8\n";
      data_text += "50 54.7\n";
      data_text += "55 59.2\n";
      data_text += "60 62.5\n";
    }
    editorInput.setValue(script_text);
    editorData.setValue(data_text);
  });
});