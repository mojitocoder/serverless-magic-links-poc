import Auth from "@aws-amplify/auth";

export const config = {
    Auth: {
        region: "eu-west-1",
        userPoolId: "eu-west-1_nToedfLLW",
        userPoolWebClientId: "5vq9t6qsuthc9mm9vrop5qjn3c",
        authenticationFlowType: "CUSTOM_AUTH"
    }
};

Auth.configure(config);
