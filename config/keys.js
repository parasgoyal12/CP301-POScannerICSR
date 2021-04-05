const path = require('path');

module.exports= {
    mongodb:{
        dbURI:"mongodb+srv://paras:test1234@cluster0.bcbrh.mongodb.net/POTEST?retryWrites=true&w=majority"
    },
    google:{
        clientID:"551028046594-iepv7ijboj80o2fafrc7sekero2rfp6u.apps.googleusercontent.com",
        clientSecret:"wSam8e_lsormfl87wGnfBPJ3",
        
    },
    session:{
        cookieKey:"Bsdk Cookie ",
    },
    google_sheet:{
        type: "service_account",
        project_id: "top-suprstate-250407",
        private_key_id: "cbe8b8f9d3e615f588436cd8efe964fe6048f692",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLC9ycm/Uhf4/F\nOyzPlpB93HcT4FZKPT/0KdQ1uVPpHPzR8B+9yS/1DoUI6aeA4XKcV851/j9qQdrK\nSYG1alq8Za/5bgRuU5A4iDSmfGR4nwePHJZE5NRTI7IXgdREypB7YalmTl3SIDlp\nSmLBx9du/HSaPrZ/6BWE/BdHHM2r48RMsuLjzfVLMDhzjlkUrQCvlZE/T2yJxn/b\nAcUCuirUR0dVRSljz4V2Rcm3UZubLPWOsKxoY0Osnstmh/L1i4DYXlN4cpZxGZPn\nb7a/XsZ3Ses7h5o40lKMNYU72+9/rX7Dm/UrKGBJ9kqt1QaMPYHsQ2PnuDDIu1QB\nMWUOpgyXAgMBAAECggEADQWOuXB7ERHoO4LnBc0nKRs5e8nYXtx8vIDuPh/LlNiq\nEiCvOHGtpK6ws3igqHBM9F/hOsn6cSsWCAEc03Clrw1qcrmuiRDM4ANENSUnIGE6\nj+AKdxKh108jvcQyw9Kl33PM9GW0OKSeafU+TiUt2M1SAQ5ij+Nndebg60uamRpe\nHH/bPRpzOA7+HCWVTWdkp7xpWFzzBHYVTwLf5+lOkWJ27yOna8edRIdBn3KfgTPY\nuyeMRe6p9CsW6O8xky7mlnR6S+huIumaupbY7vP62NbhZRqg5XFZ+TbzoAChzNCR\nMVhnKAl2y3YbdFQXg8lStvsCNSqE+i8IlL2V+IgDoQKBgQDqK9S2gqltWtR50I4h\n9gJmWH57jMQIpJWfslZHCwNSOStt7VCJ+NrFNv7lqV9V4otP+/zfwHfbgvNiNeAb\nqqryLWTo5OPlIk4vzPlrAXq2SYaEgc/tn4NnH/F1i3bZcjfgbOYn3AyjjPuBEz3B\n+ZcoZrSguRFlznHO5oEP7fVU0QKBgQDd+UdwmZAywd88lnjoyrEOPe5FV4dY2IQH\nvm8DvI8LHj5dewuNHmQ2GN9WJ6KLp7z/t9b6jU5kB/v9E0qO+H/ZE6wy8W9CzFft\n/UBrq5AFaK3DrGCDeySvNeD46XNpaNx+PryX3Xm62sUhxfxTQmG8W7ro72JC/Hqw\nDwuH249E5wKBgH3+w17IAt1B59z7J96B/VyP9M4JOVjlJVRdoiprdIgDFqj47UKv\nURaXtqJfdVpCoG6SyMajSlojpUyMbF62f2/6mLbuoOgigysZAIJgs2PtP6GALx5N\nm2gbOdHjDjmFSSdJsLR1o59ENfaHIc2Cu6ATUtC/guriHz4RrBOkF0JhAoGAd18T\nWC59KY6xKrgRFb/LL8mGVawYkWL+vdtfgDbrBiOhjkwZji6F3cHKeV6fP1NZhHut\nFNjhC1Jv5U12jyR8PJUjydGk79tMfiPvfPeqX/5HVC9jR9H1jHQBJFsHQeyuhwXe\nDh2A1UfJM7xxUaUlQlJiVdpGkZeNsxikLs+YYIkCgYEApKm44XYCwj0i+DvnttrA\nPrrSqmtF5ktct1lOctxCB+LtLnTcWORCo1ik2yvnEX2nyleUEDmmUvJ1TcF9ejF/\nyo9JoZbMSd4kBSWw0TUvb245sB5W7DKnN/oI8ZhR+97w9JiKg7xUnpoBNuIt+vk7\nJcNgHv/NJzObEimuf6lF/A8=\n-----END PRIVATE KEY-----\n",
        client_email: "poscanner@top-suprstate-250407.iam.gserviceaccount.com",
        client_id: "112370626720425126636",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/poscanner%40top-suprstate-250407.iam.gserviceaccount.com",
        sheetID:"1_ocBC1ZivRtrCScKbuKX4mMX_ECEqpDq2VcoeyuuL3E"
    },
    test:{
        id:"poconfirmation1@gmail.com",
        password: "potest123",
    },
    driveFolder: '1D8gnOtvd1n9bLqY4u3Re6AFldQ5U3HVY'
};

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname,'top-suprstate-250407-cbe8b8f9d3e6.json');
