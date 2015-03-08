var firebase = require('firebase');

var return_url = process.env.APP_BASE_URL + process.env.APP_PAYPAL_SUCCESS_CALLBACK;
var cancel_url = process.env.APP_BASE_URL + process.env.APP_PAYPAL_CANCEL_CALLBACK;

//create a firebase connection
var firebaseRef = new firebase(process.env.PPFIREBASE_URL); // Need to change FB URL
//authenticate with firebase server
firebaseRef.authWithCustomToken(process.env.PPFIREBASE_TOKEN, function(error, authData){ // Need to change FB Token
    if(error){
        throw "Firebase Auth Failed for server!";
    }
});

//model object
module.exports = {
    'firebase': firebaseRef,
    'plans': {
        //defines the plans that are available
        "1": {
            "description": "Air Guitar Semi-Pro Plan 7 Pedal Slots for the cost of 5 Plan",
            "merchant_preferences": {
                "auto_bill_amount": "yes",
                "cancel_url": cancel_url,
                "initial_fail_amount_action": "continue",
                "max_fail_attempts": "1",
                "return_url": return_url,
                "setup_fee": {
                    "currency": "SGD",
                    "value": "0"
                }
            },
            "name": "Air Guitar Semi-Pro Plan",
            "payment_definitions": [
                {
                    "amount": {
                        "currency": "SGD",
                        "value": "20.99"
                    },
                    "cycles": "0",
                    "frequency": "MONTH",
                    "frequency_interval": "1",
                    "name": "Semi-Pro",
                    "type": "REGULAR"
                },
               
            ],
            "type": "INFINITE"
        },
        '2': {
            "description": "Air Guitar Pro Plan 15 Pedal Slots for the cost of 10 Plan",
            "merchant_preferences": {
                "auto_bill_amount": "yes",
                "cancel_url": cancel_url,
                "initial_fail_amount_action": "continue",
                "max_fail_attempts": "1",
                "return_url": return_url,
                "setup_fee": {
                    "currency": "SGD",
                    "value": "0"
                }
            },
            "name": "Air Guitar Pro Plan",
            "payment_definitions": [
                {
                    "amount": {
                        "currency": "SGD",
                        "value": "41.99"
                    },
                    "cycles": "0",
                    "frequency": "MONTH",
                    "frequency_interval": "1",
                    "name": "Pro",
                    "type": "REGULAR"
                }
            ],
            "type": "INFINITE"
        }  
    },
    //defines the data required to activate the plan
    'activatePlan':[{
        "op": "replace",
        "path": '/',
        "value": {
            "state": "ACTIVE"
        }
    }],
    //creates billing agreement data based on the tier and address
    'createAgreementData': function(tier, planId, address){
        return {
            "name": tier == '1'? "Air Guitar Semi-Pro Plan": "Air Guitar Pro Plan",
            "description": tier == '1'? "Air Guitar Semi-Pro Plan 7 Pedal Slots for the cost of 5 Plan": "Air Guitar Pro Plan 15 Pedal Slots for the cost of 10 Plan",
            "start_date": getStartDate(),
            "plan":{
                "id": planId
            },
            "payer": {
                "payment_method": "paypal"
            },
            "shipping_address":{
                "line1": address["line1"] ? address["line1"]:"",
                "line2": address["line2"] ? address["line2"]:"",
                "city": address["city"] ? address["city"]:"",
                "state": address["state"] ? address["state"]:"",
                "postal_code": address["postal_code"] ? address["postal_code"]:"",
                "country_code": address["country_code"] ? address["country_code"]:""
            }
        }
    },
    //sample address
    'address':{
        'line1': '1 Rockstar Road',
        'line2': '#66-6',
        'city': 'Singapore',
        'state': 'Singapore',
        'postal_code': '666666',
        'country_code': 'SG'
    }
}

//utlity functions to make generating the start date above easier
function PadZeros(value, desiredStringLength){
    var num = value + "";
    while (num.length < desiredStringLength){
        num = "0" + num;
    }
    return num;
}
function toIsoString(d){
    return d.getUTCFullYear() + '-' + PadZeros(d.getUTCMonth() + 1, 2) + '-' + PadZeros(d.getUTCDate(), 2) + 'T' + PadZeros(d.getUTCHours(), 2) + ':' + PadZeros(d.getUTCMinutes(), 2) + ':' + PadZeros(d.getUTCSeconds(), 2) + 'Z';
}

function getStartDate(){
    var start_date = new Date();
    start_date.setMinutes(start_date.getMinutes() + 5);
    return toIsoString(start_date);
}