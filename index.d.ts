    declare global {
      interface Window {
        recaptchaVerifier: any; 
        confirmationResult: any;
        // Or the specific type of RecaptchaVerifier
        // Add other custom properties on window if needed
      }
    }
    export {}; // This line is important to make it a module