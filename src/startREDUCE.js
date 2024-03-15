import {Global                 } from './Global.js';
import {createNewInput         } from './InputEditor.js';
import {reduceWebErrorHandler  } from './Main.js';
import {reduceWebMessageHandler} from './Main.js';
import {loadPackage            } from './loadPackage.js';
import {sendToReduce           } from './sendToReduce.js';
import {sleep                  } from './sleep.js';
/** @type {Worker} */
export let worker;
async function startREDUCE() {
  try {
    // Doesn't seem to catch errors in the worker!
    // Need to catch worker errors in the worker and pass them out as messages.
    worker = new Worker(Global.mobileVersion ? "mobile/reduce.web.js" : "reduce.web.js");
    worker.onmessage = reduceWebMessageHandler;
    worker.onerror = reduceWebErrorHandler;
    // Waiting 500ms is probably not REDUCE related, but MathJax.
    // For some reason there is simply no TeX formatting otherwise.
    // TODO: send init message from worker - may be worker script related aswell.
    await sleep(500);
    // The rejectionhandled and unhandledrejection events described
    // on MDN don't seem to work or to be in the official spec!
    await sendToReduce(`<<
      lisp (!*redefmsg := nil);
      load_package tmprint;
      on nat, fancy, errcont;
      off int;
    >>$`);
    await loadPackage('gnuplot');
    await loadPackage('turtle');
    await sendToReduce(`<<
      % Test: symbolic plot!-filename(); % Should return "/tmp/data.txt"
      symbolic procedure plot!-filename();
      begin
        return "/tmp/plotdata.txt";
      end;
      symbolic procedure PlotOpenDisplay();
      begin
        plotpipe!* := open("/tmp/plotcmds.txt", 'output);
        if null plotheader!* then <<
          nil
        >> else if atom plotheader!* then <<
          plotprin2 plotheader!*;
          plotterpri()
        >> else if eqcar(plotheader!*,'list) then
          for each x in cdr plotheader!* do <<
          plotprin2 x;
          plotterpri()
        >> else <<
          typerr(plotheader!*,"gnuplot header");
        >>
      end;
    >>$`);
    createNewInput();
  } catch (error) {
    reduceWebErrorHandler(error);
    throw error; // cannot continue
  }
}
export {startREDUCE};
