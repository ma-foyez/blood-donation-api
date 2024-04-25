
require('dotenv').config();

const apiKey = process.env.SMS_API_KEY;
const sender_id = process.env.SMS_SENDER_ID;
const apiEndpoint = 'http://bulksmsbd.net/api/smsapi';

const sendOtpViaSMS = async (mobileNumber, userName, otp) => {
    const message = `Dear ${userName}, welcome to ${process.env.APP_NAME}! Your registration OTP is: ${otp}. Please do not share this OTP with anyone.`;
    // Construct the request data
    const requestData = {
        api_key: apiKey,
        senderid: sender_id,
        number: mobileNumber,
        message: message
    };
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json(); // Convert response to JSON format
        console.log('Response from SMS provider:', responseData.success_message); // Log response data

    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};



const passwordResetOtpSMS = async (mobileNumber, otp) => {

    const message = `Dear user, never share your OTP with anyone. Use ${otp} to verify your password reset request.`;
    // Construct the request data
    const requestData = {
        api_key: apiKey,
        senderid: sender_id,
        number: mobileNumber,
        message: message
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json(); // Convert response to JSON format
        console.log('Response from SMS provider:', responseData.success_message); // Log response data

    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
    }
};
module.exports = { sendOtpViaSMS, passwordResetOtpSMS }