let config = {}
console.log('Environment:::', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    config = {
        API_BASE_URL: 'https://api.saviour.health:8443/api/v1/admin/',
        // API_BASE_URL: 'http://3.8.110.152:8443/api/v1/admin/',
        KEY: 'pvmkzIHGDgskwof##@gdhapbvmgh4Y545gahfhbuntydjsdflafdhflaflhpifnxoamc',
        AUTHORIZATION: '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#SAVIOUR',
        STRIPE_CLIENT_KEY: 'pk_test_X1sxG0pyAae24oRYoaEMe5Pi',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    };
}
else {
 
    config = {
        API_BASE_URL: 'https://api.saviour.health:8443/api/v1/admin/', //'http://192.168.1.88:3005/v1/',  http://192.168.0.107:3006/api/v1/admin/
        // API_BASE_URL: 'http://3.8.110.152:8443/api/v1/admin/',
        KEY: 'pvmkzIHGDgskwof##@gdhapbvmgh4Y545gahfhbuntydjsdflafdhflaflhpifnxoamc',
        AUTHORIZATION: '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#SAVIOUR',
        STRIPE_CLIENT_KEY: 'pk_test_X1sxG0pyAae24oRYoaEMe5Pi',
        API_KEY: 'AIzaSyByh9XOHvAAr1GMWwcXglrj2fGidPUYcO8',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    };
}

export default config;