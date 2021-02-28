const path = require('path');

module.exports= {
    mongodb:{
        dbURI:"DB URI"
    },
    google:{
        clientID:"client ID",
        clientSecret:"Secret Key"
    },
    session:{
        cookieKey:"Bsdk Cookie ",
    },
    google_sheet:{
        type: "",
        project_id: "",
        private_key_id: "",
        private_key: "",
        client_email: "",
        client_id: "",
        auth_uri: "",
        token_uri: "",
        auth_provider_x509_cert_url: "",
        client_x509_cert_url: "",
        sheetID:"1_ocBC1ZivRtrCScKbuKX4mMX_ECEqpDq2VcoeyuuL3E"
    }
};

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'googleKeyApi.json');