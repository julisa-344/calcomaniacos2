/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configura el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña-de-gmail',
  },
});

exports.sendPurchaseEmail = functions.firestore
  .document('purchases/{purchaseId}')
  .onCreate(async (snap, context) => {
    const purchase = snap.data();
    const userEmail = purchase.userEmail;
    const adminEmail = 'julisa.leon344@gmail.com';

    const mailOptions = {
      from: 'tu-email@gmail.com',
      to: userEmail,
      subject: 'Resumen de tu compra',
      text: `Gracias por tu compra! Aquí tienes el resumen de tu compra: ${JSON.stringify(purchase.items)}`,
    };

    const adminMailOptions = {
      from: 'tu-email@gmail.com',
      to: adminEmail,
      subject: 'Nueva compra realizada',
      text: `Se ha realizado una nueva compra. Aquí tienes el resumen: ${JSON.stringify(purchase.items)}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(adminMailOptions);
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  });