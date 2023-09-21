/* eslint-disable no-inner-declarations */
import { PHONENUMBER_MCC } from "@whiskeysockets/baileys";
import readline from "readline";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = (q) =>
	new Promise((res) => {
		rl.question(q, res);
	});

export default async function otp(sock) {
	if (!sock.authState.creds.registered) {
		const { registration } = sock.authState.creds || { registration: {} };

		if (!registration.phoneNumber) {
			registration.phoneNumber = config.number;
		}

		const libPhonenumber = await import("libphonenumber-js");
		const phoneNumber = libPhonenumber.parsePhoneNumber(registration?.phoneNumber);
		if (!phoneNumber?.isValid()) {
			throw new Error("Invalid phone number: " + registration?.phoneNumber);
		}

		registration.phoneNumber = phoneNumber.format("E.164");
		registration.phoneNumberCountryCode = phoneNumber.countryCallingCode;
		registration.phoneNumberNationalNumber = phoneNumber.nationalNumber;
		const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode];
		if (!mcc) {
			throw new Error(
				"Could not find MCC for phone number: " +
					registration?.phoneNumber +
					"\nPlease specify the MCC manually."
			);
		}

		registration.phoneNumberMobileCountryCode = mcc;
		async function enterCode() {
			try {
				const code = await question("Please enter the one time code:\n");
				const response = await sock.register(
					code.replace(/["']/g, "").trim().toLowerCase()
				);
				console.log("Successfully registered your phone number.");
				console.log(response);
				rl.close();
			} catch (error) {
				console.error(
					"Failed to register your phone number. Please try again.\n",
					error
				);
				await askForOTP();
			}
		}
		async function enterCaptcha(sock) {
			const response = await sock.requestRegistrationCode({
				...registration,
				method: "captcha",
			});
			const path = __dirname + "/captcha.png";
			fs.writeFileSync(path, Buffer.from(response?.image_blob, "base64"));

			open(path);
			const code = await question("Please enter the captcha code:\n");
			fs.unlinkSync(path);
			registration.captcha = code.replace(/["']/g, "").trim().toLowerCase();
		}
		async function askForOTP() {
			if (!registration.method) {
				let code = await question(
					"How would you like to receive the one time code for registration? sms or voice\n"
				);
				code = code.replace(/["']/g, "").trim().toLowerCase();
				if (code !== "sms" && code !== "voice") {
					return await askForOTP();
				}

				registration.method = code;
			}

			try {
				await sock.requestRegistrationCode(registration);
				await enterCode(sock);
			} catch (error) {
				console.error(
					"Failed to request registration code. Please try again.\n",
					error
				);

				if (error?.reason === "code_checkpoint") {
					await enterCaptcha();
				}

				await askForOTP();
			}
		}
		askForOTP();
	}
}
