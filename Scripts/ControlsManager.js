"use strict";

//requires d3.js 

export default function ControlsManager(){
  let
    viewers = [],
    in_theta_deg = 45,
    in_phi_deg = 0,
    addViewer = function(new_viewer){
      viewers.push(new_viewer);
    },
    setupUI = function() {
      //FIXME: ControlsManager should be writing to its
      //own div, not to #brdf-menu
      let menu = d3.select("#brdf-menu");
      let thetaInput;
      let thetaOutput;
      let phiInput;
      let phiOutput;
      let camRotInput;

      //FIXME: this gets called before
      //setupUI() gets called in BRDFViewport. 
      //Necessary for now because both are writing 
      //to the same div. 
      menu.html("");

      /* Add incident theta slider */
      menu.append("input")
        .attr("id", "slider_incidentTheta")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", 90)
        .attr("step", 1)
        .attr("value", 0);

      menu.append("output")
        .attr("id", "output_incidentTheta");

      /* Add incident phi slider */
      menu.append("input")
        .attr("id", "slider_incidentPhi")
        .attr("type", "range")
        .attr("min", -180)
        .attr("max", 180)
        .attr("step", 1)
        .attr("value", 0);

      menu.append("output")
        .attr("id", "output_incidentPhi");

    },

    setupUICallbacks = function() {
      let output_incidentTheta = document.getElementById("output_incidentTheta");
      let output_incidentPhi = document.getElementById("output_incidentPhi");

      //Set initial values
      output_incidentTheta.innerHTML = in_theta_deg; 
      output_incidentPhi.innerHTML = in_phi_deg; 

      document.getElementById("slider_incidentTheta").oninput = (event) => {
        console.log(event.target.value);
      };

      document.getElementById("slider_incidentPhi").oninput = (event) => {
        console.log(event.target.value);
      };
    };

  //************* Start "constructor" **************
  setupUI();
  setupUICallbacks();
  //************* End "constructor" **************

  return Object.freeze({
    addViewer    
  });
}
