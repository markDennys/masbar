import { Component, OnInit } from "@angular/core";
import { Config } from "src/assets/Config";
import { FaceTecSDK } from "src/assets/core-sdk/FaceTecSDK.js/FaceTecSDK";
import { LivenessCheckProcessor } from "src/assets/processors/LivenessCheckProcessor";
import { SampleAppUtilities } from "src/assets/utilities/SampleAppUtilities";
import { AngularSampleApp } from "../assets/angular-sample-controller";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  public latestProcessor: LivenessCheckProcessor;

  constructor() {}

  ngOnInit(): void {
    console.log("aqui");
    FaceTecSDK.setLowLightCustomization(null);

    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory("/assets/core-sdk/FaceTecSDK.js/resources");
    // FaceTecSDK.setCustomization(set());

    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory("/assets/core-sdk/FaceTec_images");

    // Initialize FaceTec Browser SDK and configure the UI features.
    FaceTecSDK.initializeInDevelopmentMode(
      Config.DeviceKeyIdentifier,
      Config.PublicFaceScanEncryptionKey,
      function (initializedSuccessfully: boolean) {
        if (initializedSuccessfully) {
          SampleAppUtilities.enableControlButtons();
          var teste = "C6 Seguro de Proteção Financeira";
          var FaceTecStrings = {
            FaceTec_accessibility_cancel_button: "Cancelar",
            FaceTec_feedback_center_face: "Centralize Seu Rosto",
            FaceTec_feedback_face_not_found: "Enquadre o Seu Rosto",
            FaceTec_feedback_move_phone_away: "Afaste-se",
            FaceTec_feedback_move_away_web: "Afaste-se",
            FaceTec_feedback_move_phone_closer: "Aproxime-se",
            FaceTec_feedback_move_phone_to_eye_level:
              "Telefone ao Nível dos Olhos",
            FaceTec_feedback_move_to_eye_level_web: "Olhe Para a Câmera",
            FaceTec_feedback_face_not_looking_straight_ahead:
              "Olhe Para Frente",
            FaceTec_feedback_face_not_upright: "Mantenha a Cabeça Reta",
            FaceTec_feedback_face_not_upright_mobile: "Mantenha a Cabeça Reta",
            FaceTec_feedback_hold_steady: "Segure Firme",
            FaceTec_feedback_move_web_closer: "Aproxime-se",
            FaceTec_feedback_move_web_even_closer: "Mais Próximo",
            FaceTec_feedback_use_even_lighting:
              "Ilumine Seu Rosto Uniformemente",
            FaceTec_instructions_header_ready_desktop:
              "Financiamento Veícular e",
            FaceTec_instructions_message_ready_desktop: `${teste}`,
            FaceTec_action_im_ready: "TIRAR FOTO",
            FaceTec_initializing_camera: "Estamos preprarando tudo pra você",
            FaceTec_retry_header: "Luz excessiva na foto",
            FaceTec_retry_subheader_message:
              "Observe o exemplo e faça uma nova selfie",
            FaceTec_retry_instruction_message_1: "",
            FaceTec_retry_your_image_label: "Sua foto",
            FaceTec_retry_ideal_image_label: "Exemplo",
            FaceTec_action_try_again: "TENTAR NOVAMENTE",
            FaceTec_result_facescan_upload_message: "Validando sua foto",
            FaceTec_result_idscan_upload_message: "",
            FaceTec_result_nfc_upload_message: "",
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
  }

  // Perform Liveness Check.
  onLivenessCheckPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    this.getSessionToken(function (sessionToken) {
      this.latestProcessor = new LivenessCheckProcessor(
        sessionToken as string,
        AngularSampleApp as any
      );
    });
  }

  onEnrollUserPressed() {
    AngularSampleApp.onEnrollUserPressed();
  }

  public getSessionToken(
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
          SampleAppUtilities.handleErrorGettingServerSessionToken();

            return;
          }
        } catch {
          // Something went wrong in parsing the response. Return an error.
          SampleAppUtilities.handleErrorGettingServerSessionToken();

          return;
        }
        sessionTokenCallback(sessionToken);
      }
    };

    XHR.onerror = function () {
      SampleAppUtilities.handleErrorGettingServerSessionToken();

    };
    XHR.send();
  }


}
