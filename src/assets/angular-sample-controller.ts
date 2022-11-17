import { Config } from "./Config";
import { FaceTecSDK } from "../assets/core-sdk/FaceTecSDK.js/FaceTecSDK";
import { LivenessCheckProcessor } from "./processors/LivenessCheckProcessor";
import { SampleAppUtilities } from "./utilities/SampleAppUtilities";
import {
  FaceTecSessionResult,
  FaceTecIDScanResult,
} from "../assets/core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import {
  FaceTecCustomization,
  FaceTecCustomizations,
  FaceTecInitialLoadingAnimationCustomization,
  
} from "./core-sdk/FaceTecSDK.js/FaceTecCustomization";
import { ThemeHelpers } from "./utilities/ThemeHelpers";
import { EnrollmentProcessor } from "./processors/EnrollmentProcessor";

export const AngularSampleApp = (function () {
  let latestEnrollmentIdentifier = "";
  let latestSessionResult: FaceTecSessionResult | null = null;
  let latestIDScanResult: FaceTecIDScanResult | null = null;
  let latestProcessor: LivenessCheckProcessor;
 
  // var currentLowLightCustomization = getLowLightCustomizationForTheme(theme);
 

  // Wait for onload to be complete before attempting o access the Browser SDK.
  window.onload = function () {
    console.log('aqui')
    FaceTecSDK.setLowLightCustomization(null);

    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory("/assets/core-sdk/FaceTecSDK.js/resources");
    FaceTecSDK.setCustomization(set());
 
    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory("/assets/core-sdk/FaceTec_images");

    // Initialize FaceTec Browser SDK and configure the UI features.
    FaceTecSDK.initializeInDevelopmentMode(
      Config.DeviceKeyIdentifier,
      Config.PublicFaceScanEncryptionKey,
      function (initializedSuccessfully: boolean) {
        if (initializedSuccessfully) {
          SampleAppUtilities.enableControlButtons();
          var teste = "C6 Seguro de Proteção Financeira"
          var FaceTecStrings = {
            "FaceTec_accessibility_cancel_button": "Cancelar",
            "FaceTec_feedback_center_face": "Centralize Seu Rosto",
            "FaceTec_feedback_face_not_found": "Enquadre o Seu Rosto",
            "FaceTec_feedback_move_phone_away": "Afaste-se",
            "FaceTec_feedback_move_away_web": "Afaste-se",
            "FaceTec_feedback_move_phone_closer": "Aproxime-se",
            "FaceTec_feedback_move_phone_to_eye_level": "Telefone ao Nível dos Olhos",
            "FaceTec_feedback_move_to_eye_level_web": "Olhe Para a Câmera",
            "FaceTec_feedback_face_not_looking_straight_ahead": "Olhe Para Frente",
            "FaceTec_feedback_face_not_upright": "Mantenha a Cabeça Reta",
            "FaceTec_feedback_face_not_upright_mobile": "Mantenha a Cabeça Reta",
            "FaceTec_feedback_hold_steady": "Segure Firme",
            "FaceTec_feedback_move_web_closer": "Aproxime-se",
            "FaceTec_feedback_move_web_even_closer": "Mais Próximo",
            "FaceTec_feedback_use_even_lighting": "Ilumine Seu Rosto Uniformemente",
            "FaceTec_instructions_header_ready_desktop": "Financiamento Veícular e",
            "FaceTec_instructions_message_ready_desktop": `${teste}`,
            "FaceTec_action_im_ready": "TIRAR FOTO",
            "FaceTec_initializing_camera": "Estamos preprarando tudo pra você",
            "FaceTec_retry_header": "Luz excessiva na foto",
            "FaceTec_retry_subheader_message": "Observe o exemplo e faça uma nova selfie",
            "FaceTec_retry_instruction_message_1": "",
            "FaceTec_retry_your_image_label": "Sua foto",
            "FaceTec_retry_ideal_image_label": "Exemplo",
            "FaceTec_action_try_again": "TENTAR NOVAMENTE",
            "FaceTec_result_facescan_upload_message": "Validando sua foto",
            "FaceTec_result_idscan_upload_message": "",
            "FaceTec_result_nfc_upload_message": ""
            //Add all strings here or reference a file or a database. (Sample Files: /core-sdk-optional/FacetecStrings.*)
          };
     
          FaceTecSDK.configureLocalization(FaceTecStrings);
        }
      

        SampleAppUtilities.displayStatus(
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(
            FaceTecSDK.getStatus()
            
          )
        );
      }
    );

    SampleAppUtilities.formatUIForDevice();
  };

  // Initiate a 3D Liveness Check.
  function onLivenessCheckPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
  set();
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(function (sessionToken) {
      latestProcessor = new LivenessCheckProcessor(
        sessionToken as string,
        AngularSampleApp as any
      );
    });
  }

  function onDesignShowcasePressed(){
    ThemeHelpers.showNewTheme();
  }



  function onEnrollUserPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the Enrollment.
    getSessionToken(function(sessionToken) {
      latestEnrollmentIdentifier = "browser_sample_app_" + SampleAppUtilities.generateUUId();
      console.log(sessionToken)
      latestProcessor = new EnrollmentProcessor(sessionToken as string, AngularSampleApp as any);
    });
  }

  // Show the final result and transition back into the main interface.
  function onComplete() {
    SampleAppUtilities.showMainUI();

    if (!latestProcessor.isSuccess()) {
      // Reset the enrollment identifier.
      latestEnrollmentIdentifier = "";

      // Show early exit message to screen.  If this occurs, please check logs.
      SampleAppUtilities.displayStatus(
        "Session exited early, see logs for more details."
      );

      return;
    }

    // Show successful message to screen
    SampleAppUtilities.displayStatus("Success");
  }

  // Get the Session Token from the server
  function getSessionToken(
    sessionTokenCallback: (sessionToken?: string) => void
  ) {
    const XHR = new XMLHttpRequest();
    XHR.open("GET", Config.BaseURL + "/session-token");
    XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    XHR.setRequestHeader(
      "X-User-Agent",
      FaceTecSDK.createFaceTecAPIUserAgentString("")
    );
    XHR.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        let sessionToken = "";
        try {
          // Attempt to get the sessionToken from the response object.
          sessionToken = JSON.parse(this.responseText).sessionToken;
          // Something went wrong in parsing the response. Return an error.
          if (typeof sessionToken !== "string") {
            onServerSessionTokenError();
            return;
          }
        } catch {
          // Something went wrong in parsing the response. Return an error.
          onServerSessionTokenError();
          return;
        }
        sessionTokenCallback(sessionToken);
      }
    };

    XHR.onerror = function () {
      onServerSessionTokenError();
    };
    XHR.send();
  }

  function onServerSessionTokenError() {
    SampleAppUtilities.handleErrorGettingServerSessionToken();
  }

  //
  // DEVELOPER NOTE:  This is a convenience function for demonstration purposes only so the Sample App can have access to the latest session results.
  // In your code, you may not even want or need to do this.
  //
  function setLatestSessionResult(sessionResult: FaceTecSessionResult) {
    latestSessionResult = sessionResult;
  }

  function setLatestIDScanResult(idScanResult: FaceTecIDScanResult) {
    latestIDScanResult = idScanResult;
  }

  function getLatestEnrollmentIdentifier() {
    return latestEnrollmentIdentifier;
  }

  function setLatestServerResult(responseJSON: any) {}

  function clearLatestEnrollmentIdentifier(responseJSON: any) {
    latestEnrollmentIdentifier = "";
  }

  function set(){
    var teste = '../../.asstes/images/teste.svg';
    var currentCustomization: FaceTecCustomization = new FaceTecSDK.FaceTecCustomization();
    const primaryColor = "#ffe552"; // red
    var themeResourceDirectory = "../../assets/images";
    var testeVoice = '../../assets/utilities/vocal_dicas'
  
    const secondaryColor = 'black';
    const backgroundColor = 'white';
    const font = "";
     const retryScreenSlideshowImages: string[] = [themeResourceDirectory + "FaceTec_ideal_1.png", themeResourceDirectory + "FaceTec_ideal_2.png", themeResourceDirectory + "FaceTec_ideal_3.png", themeResourceDirectory + "FaceTec_ideal_4.png", themeResourceDirectory + "FaceTec_ideal_5.png"];
  
  
    var activityIndicatorSVG: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    activityIndicatorSVG.classList.add("ekyc-activity-indicator-svg");
    activityIndicatorSVG.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(24 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8666666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(48 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(72 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.7333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(96 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(120 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(144 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(168 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4666666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(192 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(216 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(240 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.26666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(264 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.2s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(288 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.13333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(312 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.06666666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(336 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate></rect></g></svg>';

    var uploadActivityIndicatorSVG: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    uploadActivityIndicatorSVG.classList.add("ekyc-activity-indicator-svg");
    uploadActivityIndicatorSVG.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(24 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8666666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(48 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(72 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.7333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(96 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(120 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(144 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(168 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4666666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(192 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(216 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(240 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.26666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(264 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.2s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(288 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.13333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(312 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.06666666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(336 50 50)"><rect x="48.5" y="24" rx="1.2" ry="1.2" width="3" height="12" fill="#666666"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate></rect></g></svg>';
  
    var successResultAnimationSVG: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    successResultAnimationSVG.setAttribute("viewBox", "0 0 52 52");
    successResultAnimationSVG.classList.add("ekyc-success-svg");
    successResultAnimationSVG.innerHTML = "<path class='checkmarkPath__back' d='M14.1 27.2l7.1 7.2 16.7-16.8'></path><path class='checkmarkPath__front' d='M14.1 27.2l7.1 7.2 16.7-16.8'></path>";
  
    var unsuccessResultAnimationSVG: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    unsuccessResultAnimationSVG.setAttribute("viewBox", "0 0 52 52");
    unsuccessResultAnimationSVG.classList.add("ekyc-unsuccess-svg");
    unsuccessResultAnimationSVG.innerHTML = "<line class='crossPath1__back' x1='18' y1='18' x2='34' y2='34'></line><line class='crossPath2__back' x1='34' y1='18' x2='18' y2='34'></line><line class='crossPath1__front' x1='18' y1='18' x2='34' y2='34'></line><line class='crossPath2__front' x1='34' y1='18' x2='18' y2='34'></line>";
  
    // Initial Loading Animation Customization
    currentCustomization.initialLoadingAnimationCustomization.customAnimation = activityIndicatorSVG;
    currentCustomization.initialLoadingAnimationCustomization.animationRelativeScale = 1.0;
    currentCustomization.initialLoadingAnimationCustomization.backgroundColor = secondaryColor;
    currentCustomization.initialLoadingAnimationCustomization.foregroundColor = primaryColor;
    currentCustomization.initialLoadingAnimationCustomization.messageTextColor = secondaryColor;
    currentCustomization.initialLoadingAnimationCustomization.messageFont = font;
    // Overlay Customization
    currentCustomization.overlayCustomization.backgroundColor = backgroundColor;
    currentCustomization.overlayCustomization.showBrandingImage = true;
    currentCustomization.overlayCustomization.brandingImage = themeResourceDirectory + "/teste.svg";
    currentCustomization.vocalGuidanceCustomization.mode = 0;
    currentCustomization.vocalGuidanceCustomization.pleaseFrameYourFaceInTheOvalSoundFile = testeVoice + '/centralize-seu-rosto.mp3';
    currentCustomization.vocalGuidanceCustomization.pleaseMoveCloserSoundFile = testeVoice + '/porfavor-se-aproxime.mp3';
    currentCustomization.vocalGuidanceCustomization.pleasePressTheButtonToStartSoundFile = testeVoice + '/aperte.mp3';
    currentCustomization.vocalGuidanceCustomization.pleaseRetrySoundFile = testeVoice + '/tente-novamente.mp3';
    currentCustomization.vocalGuidanceCustomization.uploadingSoundFile = testeVoice + '/uploading.mp3';
    currentCustomization.vocalGuidanceCustomization.facescanSuccessfulSoundFile = testeVoice + '/facescan_sucesso.mp3';
    // Guidance Customization
    currentCustomization.guidanceCustomization.backgroundColors = backgroundColor;
    currentCustomization.guidanceCustomization.foregroundColor = secondaryColor;
    currentCustomization.guidanceCustomization.headerFont = font;
    currentCustomization.guidanceCustomization.subtextFont = font;
    currentCustomization.guidanceCustomization.buttonFont = font;
    currentCustomization.guidanceCustomization.buttonTextNormalColor = secondaryColor;
    currentCustomization.guidanceCustomization.buttonBackgroundNormalColor = primaryColor;
    currentCustomization.guidanceCustomization.buttonTextHighlightColor = secondaryColor;
    currentCustomization.guidanceCustomization.buttonBackgroundHighlightColor = primaryColor;
    currentCustomization.guidanceCustomization.buttonTextDisabledColor = secondaryColor;
    currentCustomization.guidanceCustomization.buttonBackgroundDisabledColor = primaryColor;
    currentCustomization.guidanceCustomization.buttonBorderColor = primaryColor;
    currentCustomization.guidanceCustomization.buttonBorderWidth = "2px";
    currentCustomization.guidanceCustomization.buttonCornerRadius = "30px";
    currentCustomization.guidanceCustomization.readyScreenOvalFillColor = "transparent";
    currentCustomization.guidanceCustomization.readyScreenTextBackgroundColor = backgroundColor;
    currentCustomization.guidanceCustomization.readyScreenTextBackgroundCornerRadius = "3px";
    currentCustomization.guidanceCustomization.readyScreenHeaderTextColor = "gray";
    currentCustomization.guidanceCustomization.readyScreenHeaderFont =secondaryColor;
    

    currentCustomization.guidanceCustomization.retryScreenImageBorderColor = primaryColor;
    currentCustomization.guidanceCustomization.retryScreenImageBorderWidth = "2px";
    currentCustomization.guidanceCustomization.retryScreenImageCornerRadius = "3px";
    currentCustomization.guidanceCustomization.retryScreenOvalStrokeColor = primaryColor;
    currentCustomization.guidanceCustomization.retryScreenSlideshowImages = retryScreenSlideshowImages;
    currentCustomization.guidanceCustomization.retryScreenSlideshowInterval = "1500ms";
    currentCustomization.guidanceCustomization.enableRetryScreenSlideshowShuffle = true;
    currentCustomization.guidanceCustomization.cameraPermissionsScreenImage = themeResourceDirectory + "ekyc/camera_red.png";
    // ID Scan Customization
    currentCustomization.idScanCustomization.showSelectionScreenDocumentImage = false;
    currentCustomization.idScanCustomization.selectionScreenDocumentImage = "";
    currentCustomization.idScanCustomization.showSelectionScreenBrandingImage = false;
    currentCustomization.idScanCustomization.selectionScreenBrandingImage = "";
    currentCustomization.idScanCustomization.selectionScreenBackgroundColors = backgroundColor;
    currentCustomization.idScanCustomization.reviewScreenBackgroundColors = backgroundColor;
    currentCustomization.idScanCustomization.captureScreenForegroundColor = backgroundColor;
    currentCustomization.idScanCustomization.reviewScreenForegroundColor = backgroundColor;
    currentCustomization.idScanCustomization.selectionScreenForegroundColor = primaryColor;
    currentCustomization.idScanCustomization.headerFont = font;
    currentCustomization.idScanCustomization.subtextFont = font;
    currentCustomization.idScanCustomization.buttonFont = font;
    currentCustomization.idScanCustomization.buttonTextNormalColor = primaryColor;
    currentCustomization.idScanCustomization.buttonBackgroundNormalColor = backgroundColor;
    currentCustomization.idScanCustomization.buttonTextHighlightColor = backgroundColor;
    currentCustomization.idScanCustomization.buttonBackgroundHighlightColor = primaryColor;
    currentCustomization.idScanCustomization.buttonTextDisabledColor = backgroundColor;
    currentCustomization.idScanCustomization.buttonBackgroundDisabledColor = backgroundColor;
    currentCustomization.idScanCustomization.buttonBorderColor = primaryColor;
    currentCustomization.idScanCustomization.buttonBorderWidth = "2px";
    currentCustomization.idScanCustomization.buttonCornerRadius = "8px";
    currentCustomization.idScanCustomization.captureScreenTextBackgroundColor = primaryColor;
    currentCustomization.idScanCustomization.captureScreenTextBackgroundBorderColor = primaryColor;
    currentCustomization.idScanCustomization.captureScreenTextBackgroundBorderWidth = "0px";
    currentCustomization.idScanCustomization.captureScreenTextBackgroundCornerRadius = "2px";
    currentCustomization.idScanCustomization.reviewScreenTextBackgroundColor = primaryColor;
    currentCustomization.idScanCustomization.reviewScreenTextBackgroundBorderColor = primaryColor;
    currentCustomization.idScanCustomization.reviewScreenTextBackgroundBorderWidth = "0px";
    currentCustomization.idScanCustomization.reviewScreenTextBackgroundBorderCornerRadius = "2px";
    currentCustomization.idScanCustomization.captureScreenBackgroundColor = backgroundColor;
    currentCustomization.idScanCustomization.captureFrameStrokeColor = primaryColor;
    currentCustomization.idScanCustomization.captureFrameStrokeWidth = "2px";
    currentCustomization.idScanCustomization.captureFrameCornerRadius = "12px";
    // OCR Confirmation Screen Customization
    currentCustomization.ocrConfirmationCustomization.backgroundColors = backgroundColor;
    currentCustomization.ocrConfirmationCustomization.mainHeaderDividerLineColor = secondaryColor;
    currentCustomization.ocrConfirmationCustomization.mainHeaderDividerLineWidth = "2px";
    currentCustomization.ocrConfirmationCustomization.mainHeaderFont = font;
    currentCustomization.ocrConfirmationCustomization.sectionHeaderFont = font;
    currentCustomization.ocrConfirmationCustomization.fieldLabelFont = font;
    currentCustomization.ocrConfirmationCustomization.fieldValueFont = font;
    currentCustomization.ocrConfirmationCustomization.inputFieldFont = font;
    currentCustomization.ocrConfirmationCustomization.inputFieldPlaceholderFont = font;
    currentCustomization.ocrConfirmationCustomization.mainHeaderTextColor = secondaryColor;
    currentCustomization.ocrConfirmationCustomization.sectionHeaderTextColor = primaryColor;
    currentCustomization.ocrConfirmationCustomization.fieldLabelTextColor = secondaryColor;
    currentCustomization.ocrConfirmationCustomization.fieldValueTextColor = secondaryColor;
    currentCustomization.ocrConfirmationCustomization.inputFieldTextColor = backgroundColor;
    currentCustomization.ocrConfirmationCustomization.inputFieldPlaceholderTextColor = "rgba(255, 255, 255, 0.4)";
    currentCustomization.ocrConfirmationCustomization.inputFieldBackgroundColor = secondaryColor;
    currentCustomization.ocrConfirmationCustomization.inputFieldBorderColor = primaryColor;
    currentCustomization.ocrConfirmationCustomization.inputFieldBorderWidth = "0px";
    currentCustomization.ocrConfirmationCustomization.inputFieldCornerRadius = "8px";
    currentCustomization.ocrConfirmationCustomization.showInputFieldBottomBorderOnly = false;
    currentCustomization.ocrConfirmationCustomization.buttonFont = font;
    currentCustomization.ocrConfirmationCustomization.buttonTextNormalColor = primaryColor;
    currentCustomization.ocrConfirmationCustomization.buttonBackgroundNormalColor = backgroundColor;
    currentCustomization.ocrConfirmationCustomization.buttonTextHighlightColor = backgroundColor;
    currentCustomization.ocrConfirmationCustomization.buttonBackgroundHighlightColor = primaryColor;
    currentCustomization.ocrConfirmationCustomization.buttonTextDisabledColor = "rgba(237, 28, 36, 0.3)";
    currentCustomization.ocrConfirmationCustomization.buttonBackgroundDisabledColor = backgroundColor;
    currentCustomization.ocrConfirmationCustomization.buttonBorderColor = primaryColor;
    currentCustomization.ocrConfirmationCustomization.buttonBorderWidth = "2px";
    currentCustomization.ocrConfirmationCustomization.buttonCornerRadius = "8px";
    // Result Screen Customization
    currentCustomization.resultScreenCustomization.backgroundColors = backgroundColor;
    currentCustomization.resultScreenCustomization.foregroundColor = secondaryColor;
    currentCustomization.resultScreenCustomization.messageFont = font;
    currentCustomization.resultScreenCustomization.activityIndicatorColor = primaryColor;
    currentCustomization.resultScreenCustomization.customActivityIndicatorImage = "";
    currentCustomization.resultScreenCustomization.customActivityIndicatorRotationInterval = "1.5s";
    currentCustomization.resultScreenCustomization.customActivityIndicatorAnimation = uploadActivityIndicatorSVG;
    currentCustomization.resultScreenCustomization.resultAnimationBackgroundColor = "transparent";
    currentCustomization.resultScreenCustomization.resultAnimationForegroundColor = "transparent";
    currentCustomization.resultScreenCustomization.resultAnimationSuccessBackgroundImage = "white";
    currentCustomization.resultScreenCustomization.resultAnimationUnsuccessBackgroundImage = "white";
    currentCustomization.resultScreenCustomization.customResultAnimationSuccess = successResultAnimationSVG;
    currentCustomization.resultScreenCustomization.customResultAnimationUnsuccess = unsuccessResultAnimationSVG;
    currentCustomization.resultScreenCustomization.showUploadProgressBar = false;
    currentCustomization.resultScreenCustomization.uploadProgressTrackColor = "red";
    currentCustomization.resultScreenCustomization.uploadProgressFillColor = primaryColor;
    currentCustomization.resultScreenCustomization.animationRelativeScale = 1.0;
    // Feedback Customization
    currentCustomization.feedbackCustomization.backgroundColor = secondaryColor;
    currentCustomization.feedbackCustomization.textColor = backgroundColor;
    currentCustomization.feedbackCustomization.textFont = font;
    currentCustomization.feedbackCustomization.cornerRadius = "3px";
    currentCustomization.feedbackCustomization.shadow = "0px 0px 0px 3px transparent";
    // Frame Customization
    currentCustomization.frameCustomization.backgroundColor = backgroundColor;
    currentCustomization.frameCustomization.borderColor = backgroundColor;
    currentCustomization.frameCustomization.borderWidth = "0px";
    currentCustomization.frameCustomization.borderCornerRadius = "2px";
    currentCustomization.frameCustomization.shadow = "5px 5px transparent";
    // Oval Customization
    currentCustomization.ovalCustomization.strokeColor = secondaryColor;
    currentCustomization.ovalCustomization.progressColor1 = secondaryColor;
    currentCustomization.ovalCustomization.progressColor2 = secondaryColor;
    // Cancel Button Customization
    currentCustomization.cancelButtonCustomization.customImage = themeResourceDirectory + "/teste.svg";
    currentCustomization.cancelButtonCustomization.location = FaceTecSDK.FaceTecCancelButtonLocation.TopLeft;
    return currentCustomization;
   
  }
   
 
  return {
    onLivenessCheckPressed,
    onComplete,
    setLatestSessionResult,
    setLatestIDScanResult,
    getLatestEnrollmentIdentifier,
    setLatestServerResult,
    clearLatestEnrollmentIdentifier,
    onDesignShowcasePressed,
    onEnrollUserPressed
  };
})();
