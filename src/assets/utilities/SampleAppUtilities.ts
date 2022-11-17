import { Config } from "../Config";
import { FaceTecSDK } from "../core-sdk/FaceTecSDK.js/FaceTecSDK";
import { UI } from "./UIFunctions";

export const SampleAppUtilities = (function() {

  function displayStatus(message: string) {
    (document.getElementById("status") as HTMLElement).innerHTML = message;
  }

  function fadeInMainUIContainer(){
    UI(".wrapping-box-container").fadeIn(800);
  }

  function fadeInMainUIControls(callback?: ()=>void) {
    if(isLikelyMobileDevice()) {
      UI("#custom-logo-container").fadeIn(800);
    }
    UI("#controls").fadeIn(800, () => {
      enableControlButtons();
      if(callback) {
        callback();
      }
    });
  }

  // Disable buttons to prevent hammering, fade out main interface elements, and reset the Session Review Screen data.
  function fadeOutMainUIAndPrepareForSession() {
    disableControlButtons();
    if(isLikelyMobileDevice()) {
      UI("#custom-logo-container").fadeOut(800);
    }
    UI("#controls").fadeOut(800);
    UI(".wrapping-box-container").fadeOut(800);
  }

  function disableControlButtons() {
    document.querySelectorAll("#controls > button").forEach(function(button) {
      button.setAttribute("disabled", "true");
    });
  }

  function enableControlButtons() {
    document.querySelectorAll("#controls > button").forEach(function(button) {
      button.removeAttribute("disabled");
    });
  }

  function showMainUI(){
    fadeInMainUIContainer();
    fadeInMainUIControls();
  }

  function handleErrorGettingServerSessionToken() {
    showMainUI();
    displayStatus("Session could not be started due to an unexpected issue during the network request.");
  }

  function generateUUId() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function formatUIForDevice() {
    if(isLikelyMobileDevice()) {
      // Adjust button sizing
      document.querySelectorAll("#controls > button").forEach(function(element) {
        if(element.className === "big-button") {
          (element as HTMLElement).style.height = "40px";
          (element as HTMLElement).style.fontSize = "18px";
        }
        else if(element.className === "medium-button") {
          (element as HTMLElement).style.height = "30px";
          (element as HTMLElement).style.fontSize = "14px";
        }

        (element as HTMLElement).style.width = "100px";
      });
      // Hide border around control panel and adjust height
      (document.getElementById("controls") as HTMLElement).style.height = "auto";
      (document.getElementById("controls") as HTMLElement).style.borderColor = "transparent";
      // Hide status label text background and decrease label font size
      (document.getElementById("status") as HTMLElement).style.backgroundColor = "transparent";
      (document.getElementById("status") as HTMLElement).style.fontSize = "12px";
      (document.getElementById("status") as HTMLElement).style.position = "inherit";
      (document.getElementById("status") as HTMLElement).style.width = "30%";
      (document.getElementById("status") as HTMLElement).style.margin = "20px auto 0";
      (document.getElementById("status") as HTMLElement).style.left = "unset";
      (document.getElementById("status") as HTMLElement).style.bottom = "unset";
      // Move logo above buttons
      (document.getElementById("custom-logo-container") as HTMLElement).parentNode.insertBefore(document.getElementById("custom-logo-container"), document.getElementById("custom-logo-container").parentNode.firstChild);
      (document.getElementById("custom-logo-container") as HTMLElement).style.margin = "0px 0px 20px 0px";
      (document.querySelector("#custom-logo-container img") as HTMLElement).style.height = "40px";
      // Center control interface on screen
      (document.getElementsByClassName("wrapping-box-container")[0] as HTMLElement).style.top = "20%";
      (document.getElementsByClassName("wrapping-box-container")[0] as HTMLElement).style.left = "20%";
      (document.getElementsByClassName("wrapping-box-container")[0] as HTMLElement).style.width = "50%";
      (document.getElementsByClassName("wrapping-box-container")[0] as HTMLElement).style.transform = "translate(-50%, -50%)";
    }
  }

  function isLikelyMobileDevice() {
    let isMobileDeviceUA = !!(/Android|iPhone|iPad|iPod|IEMobile|Mobile|mobile/i.test(navigator.userAgent || ""));
    // ChromeOS/Chromebook detection.
    if(isMobileDeviceUA && ((navigator.userAgent.indexOf("CrOS") !== -1 ) || (navigator.userAgent.indexOf("Chromebook") !== -1 ) )) {
      isMobileDeviceUA = false;
    }
    // Mobile device determination based on portrait / landscape and user agent.
    if(screen.width < screen.height || isMobileDeviceUA) {
      // Assume mobile device when in portrait mode or when determined by the user agent.
      return true;
    }
    else {
      return false;
    }
  }

  return {
    displayStatus,
    fadeOutMainUIAndPrepareForSession,
    enableControlButtons,
    generateUUId,
    formatUIForDevice,
    handleErrorGettingServerSessionToken,
    showMainUI,
    isLikelyMobileDevice,
    UI
  };
})();
