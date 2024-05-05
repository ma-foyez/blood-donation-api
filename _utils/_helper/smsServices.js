
require('dotenv').config();

const apiKey = process.env.SMS_API_KEY;
const sender_id = process.env.SMS_SENDER_ID;
const apiEndpoint = process.env.SMS_API_ENDPOINT;

const registerSMS = async (mobileNumber, userName, otp) => {
    const message = `Dear ${userName},\nPlease use the OTP ${otp} to successfully register your account. Remember, never share your OTP with anyone.\n\n-${process.env.APP_NAME}`;
    // Construct the request data
    const requestData = {
        sender_id: sender_id,
        receiver: mobileNumber,
        message: message,
        remove_duplicate: true
    };
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();
        console.log('Response from SMS provider:', responseData);

    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};



const passwordResetOtpSMS = async (mobileNumber, otp) => {

    const message = `Never share your OTP with anyone. Use ${otp} to verify your password reset request.\n\n -${process.env.APP_NAME}`;

    // Construct the request data
    const requestData = {
        sender_id: sender_id,
        receiver: mobileNumber,
        message: message,
        remove_duplicate: true
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json(); // Convert response to JSON format
        console.log('Response from SMS provider:', responseData); // Log response data

    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};


const registrationSuccessSMS = async (mobileNumber, userName) => {
    const message = `Dear ${userName},\nWelcome to ${process.env.APP_NAME}!\nYour registration has been successful. Thank you for joining us!\n\n-${process.env.APP_NAME}`;
    // Construct the request data
    const requestData = {
        sender_id: sender_id,
        receiver: mobileNumber,
        message: message,
        remove_duplicate: true
    };
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();
        console.log('Response from SMS provider:', responseData);

    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};

const regenerateOtpMessage = async (mobileNumber, otp) => {
    const message = `Never share your OTP with anyone. Use ${otp} to verify your request.\n\n -${process.env.APP_NAME}`;
    // Construct the request data
    const requestData = {
        sender_id: sender_id,
        receiver: mobileNumber,
        message: message,
        remove_duplicate: true
    };
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();
        console.log('Response from SMS provider:', responseData);

    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};


module.exports = { registerSMS, passwordResetOtpSMS, registrationSuccessSMS, regenerateOtpMessage }