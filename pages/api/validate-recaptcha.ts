// Validate ReCaptcha

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return res.status(405);
	}
	const secret = process.env.GOOGLE_RECAPTCHA_SITE_SECRET;
	if (!secret) {
		throw new Error("No GOOGLE_RECAPTCHA_SITE_SECRET set.");
	}
	const token = req.body.token;
	const response = await axios.post(
		`https://www.google.com/recaptcha/api/siteverify`,
		{
			secret,
			response: token,
		},
		{
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		}
	);
	return res.send(response.data);
};
export default handler;
