export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}
import { InputTypeWithoutIcon } from "../types";
export const smoothScrollToId = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
	}
};
export function checkIfMobile() {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || (window as any).opera);
	return check;
}

export const arrayOfKeysToObject = (keysArray: string[]) => {
	return Object.fromEntries(keysArray.map((key) => [key, "-"]));
};

export const objectToUrlParams = (object: { [key: string]: any }): string => {
	const encoded = Object.entries(object)
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join("&");
	return encoded;
};
export const getKeysFromObjects = (
	arrayOfObjects: {
		[key: string]: any;
	}[]
) => {
	// Get all keys from objects in the array
	const allKeys: string[] = [].concat(
		...(arrayOfObjects
			? (arrayOfObjects?.map((obj) => Object.keys(obj)) as any)
			: [])
	);

	// Remove duplicates (if needed)
	const uniqueKeys: string[] = Array.from(new Set(allKeys));

	return uniqueKeys;
};

export const generateIdFromName = (
	name: string,
	inputs: InputTypeWithoutIcon[]
) => {
	const fieldName = name
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "");

	if (inputs && inputs.length > 0) {
		// Check if the name already exists
		// If yes, add a number to the end of the name
		// If a name with the number exists, increment the number
		let nameExists = false;
		let nameExistsCount = 0;
		let newName = fieldName;
		do {
			nameExists = false;
			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i].id === newName) {
					nameExists = true;
					nameExistsCount++;
					newName = `${fieldName}-${nameExistsCount}`;
					break;
				}
			}
		} while (nameExists);
		return newName;
	}

	return fieldName;
};

export const isNumber = (value?: string) => {
	if (!value) return false;
	if (typeof value === "number") return true;
	if (value === "") return false;
	return !isNaN(Number(value));
};

export const getFieldMessageFromTag = (tag: string, fieldName: string) => {
	switch (tag) {
		case "min":
			return `${fieldName} is too short`;
		case "max":
			return `${fieldName} is too long`;
		case "len":
			return `${fieldName} is not the correct length`;
		case "required":
			return `${fieldName} is required`;
		case "unique":
			return `${fieldName} is already used`;
		default:
			return `${fieldName} is invalid`;
	}
};
export const convertToCamelCase = (str: string) => {
	let ans = str;
	// make the first character lowercase and return the string
	return ans.charAt(0).toLowerCase() + ans.slice(1);
};

export const convertKBtoMB = (sizeInKb = 1) => {
	if (!sizeInKb || sizeInKb === 0) {
		return sizeInKb + "KB";
	}
	const sizeInMb = sizeInKb / 1000;

	if (sizeInMb < 1) {
		return `${sizeInKb.toFixed(0)}KB`;
	} else {
		return `${sizeInMb.toFixed(0)}MB`;
	}
};

export function formatBold(text?: string) {
	if (!text) return "";
	return text?.replace(/\*(.*?)\*/g, "<b>$1</b>");
}

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export function dataUrlToFile(
	dataUrl: string,
	filename: string
): File | undefined {
	const arr = dataUrl.split(",");
	if (arr.length < 2) {
		return undefined;
	}
	const mimeArr = arr[0].match(/:(.*?);/);
	if (!mimeArr || mimeArr.length < 2) {
		return undefined;
	}
	const mime = mimeArr[1];
	const buff = Buffer.from(arr[1], "base64");
	return new File([buff], filename, { type: mime });
}

export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
export const getCenterFromWidthAndHeight = ({
	w,
	h,
}: {
	w: number;
	h: number;
}) => {
	const dualScreenLeft =
		window.screenLeft !== undefined ? window.screenLeft : window.screenX;
	const dualScreenTop =
		window.screenTop !== undefined ? window.screenTop : window.screenY;

	const width = window.innerWidth
		? window.innerWidth
		: document.documentElement.clientWidth
		? document.documentElement.clientWidth
		: screen.width;
	const height = window.innerHeight
		? window.innerHeight
		: document.documentElement.clientHeight
		? document.documentElement.clientHeight
		: screen.height;

	const systemZoom = width / window.screen.availWidth;
	const left = (width - w) / 2 / systemZoom + dualScreenLeft;
	const top = (height - h) / 2 / systemZoom + dualScreenTop;

	return { left, top };
};

export const getDeviceAndOs = () => {
	let osVersion;

	/* test cases
        alert(
            'browserInfo result: OS: ' + browserInfo.os +' '+ browserInfo.osVersion + '\n'+
                'Browser: ' + browserInfo.browser +' '+ browserInfo.browserVersion + '\n' +
                'Mobile: ' + browserInfo.mobile + '\n' +
                'Cookies: ' + browserInfo.cookies + '\n' +
                'Screen Size: ' + browserInfo.screen
        );
    */
	var unknown = "Unknown";

	let width, height;
	// screen
	var screenSize = "";
	if (screen.width) {
		width = screen.width ? screen.width : "";
		height = screen.height ? screen.height : "";
		screenSize += "" + width + " x " + height;
	}

	//browser
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browser = navigator.appName;
	var version = "" + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;

	// Opera
	if ((verOffset = nAgt.indexOf("Opera")) != -1) {
		browser = "Opera";
		version = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf("Version")) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// MSIE
	else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
		browser = "Microsoft Internet Explorer";
		version = nAgt.substring(verOffset + 5);
	}

	//IE 11 no longer identifies itself as MS IE, so trap it
	//http://stackoverflow.com/questions/17907445/how-to-detect-ie11
	else if (browser == "Netscape" && nAgt.indexOf("Trident/") != -1) {
		browser = "Microsoft Internet Explorer";
		version = nAgt.substring(verOffset + 5);
		if ((verOffset = nAgt.indexOf("rv:")) != -1) {
			version = nAgt.substring(verOffset + 3);
		}
	}

	// Chrome
	else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
		browser = "Chrome";
		version = nAgt.substring(verOffset + 7);
	}
	// Safari
	else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
		browser = "Safari";
		version = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf("Version")) != -1) {
			version = nAgt.substring(verOffset + 8);
		}

		// Chrome on iPad identifies itself as Safari. Actual results do not match what Google claims
		//  at: https://developers.google.com/chrome/mobile/docs/user-agent?hl=ja
		//  No mention of chrome in the user agent string. However it does mention CriOS, which presumably
		//  can be keyed on to detect it.
		if (nAgt.indexOf("CriOS") != -1) {
			//Chrome on iPad spoofing Safari...correct it.
			browser = "Chrome";
			//Don't believe there is a way to grab the accurate version number, so leaving that for now.
		}
	}
	// Firefox
	else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
		browser = "Firefox";
		version = nAgt.substring(verOffset + 8);
	}
	// Other browsers
	else if (
		(nameOffset = nAgt.lastIndexOf(" ") + 1) <
		(verOffset = nAgt.lastIndexOf("/"))
	) {
		browser = nAgt.substring(nameOffset, verOffset);
		version = nAgt.substring(verOffset + 1);
		if (browser.toLowerCase() == browser.toUpperCase()) {
			browser = navigator.appName;
		}
	}
	// trim the version string
	if ((ix = version.indexOf(";")) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(" ")) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(")")) != -1) version = version.substring(0, ix);

	majorVersion = parseInt("" + version, 10);
	if (isNaN(majorVersion)) {
		version = "" + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	// mobile version
	var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

	// system
	var os = unknown;
	var clientStrings = [
		{ s: "Windows 3.11", r: /Win16/ },
		{ s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
		{ s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
		{ s: "Windows 98", r: /(Windows 98|Win98)/ },
		{ s: "Windows CE", r: /Windows CE/ },
		{ s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
		{ s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
		{ s: "Windows Server 2003", r: /Windows NT 5.2/ },
		{ s: "Windows Vista", r: /Windows NT 6.0/ },
		{ s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
		{ s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
		{ s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
		{
			s: "Windows NT 4.0",
			r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
		},
		{ s: "Windows ME", r: /Windows ME/ },
		{ s: "Android", r: /Android/ },
		{ s: "Open BSD", r: /OpenBSD/ },
		{ s: "Sun OS", r: /SunOS/ },
		{ s: "Linux", r: /(Linux|X11)/ },
		{ s: "iOS", r: /(iPhone|iPad|iPod)/ },
		{ s: "Mac OS X", r: /Mac OS X/ },
		{ s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
		{ s: "QNX", r: /QNX/ },
		{ s: "UNIX", r: /UNIX/ },
		{ s: "BeOS", r: /BeOS/ },
		{ s: "OS/2", r: /OS\/2/ },
		{
			s: "Search Bot",
			r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
		},
	];
	for (var id in clientStrings) {
		var cs = clientStrings[id];
		if (cs.r.test(nAgt)) {
			os = cs.s;
			break;
		}
	}

	if (/Windows/.test(os)) {
		osVersion = /Windows (.*)/.exec(os)?.[1];
		os = "Windows";
	}

	switch (os) {
		case "Mac OS X":
			osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)?.[1];
			break;

		case "Android":
			osVersion = /Android ([\.\_\d]+)/.exec(nAgt)?.[1];
			break;

		case "iOS":
			osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
			osVersion =
				osVersion?.[1] +
				"." +
				osVersion?.[2] +
				"." +
				(osVersion?.[3] ?? 0);
			break;
	}

	return {
		screen: screenSize,
		browser: browser,
		browserVersion: version,
		mobile: mobile,
		os: os,
		osVersion: osVersion,
	};
};

export const matchConditionAndValue = ({
	condition,
	value: valueToCheck,
	fieldValue: fieldValue,
}: {
	condition: string;
	value: string | number | undefined | null;
	fieldValue: string | number | undefined | null;
}) => {
	switch (condition) {
		case "equals":
			return fieldValue == valueToCheck;
		case "does not equal":
			return fieldValue != valueToCheck;

		case "is empty":
			return (
				!fieldValue ||
				(typeof fieldValue === "string" && fieldValue.length === 0) ||
				typeof fieldValue === "undefined" ||
				fieldValue === null ||
				(typeof fieldValue === "string" && fieldValue === "")
			);
		case "is not empty":
			return !(
				!fieldValue ||
				(typeof fieldValue === "string" && fieldValue.length === 0) ||
				typeof fieldValue === "undefined" ||
				fieldValue === null ||
				(typeof fieldValue === "string" && fieldValue === "")
			);
		case "contains":
			return (
				valueToCheck &&
				fieldValue?.toString()?.includes(valueToCheck?.toString())
			);

		case "does not contain":
			return !(
				valueToCheck &&
				fieldValue?.toString()?.includes(valueToCheck?.toString())
			);
		case "starts with":
			return (
				valueToCheck &&
				fieldValue?.toString()?.startsWith(valueToCheck?.toString())
			);
		case "does not start with":
			return !(
				valueToCheck &&
				fieldValue?.toString()?.startsWith(valueToCheck?.toString())
			);

		case "ends with":
			return (
				valueToCheck &&
				fieldValue?.toString()?.endsWith(valueToCheck?.toString())
			);
		case "does not end with":
			return !(
				valueToCheck &&
				fieldValue?.toString()?.endsWith(valueToCheck?.toString())
			);
		case "greater than":
			return valueToCheck && fieldValue && fieldValue > valueToCheck;

		case "less than":
			return valueToCheck && fieldValue && fieldValue < valueToCheck;

		case "greater than or equal to":
			return valueToCheck && fieldValue && fieldValue >= valueToCheck;

		case "less than or equal to":
			return valueToCheck && fieldValue && fieldValue <= valueToCheck;
	}
};

export const createUrlWithParams = (
	url: string,
	params: {
		[key: string]: any;
	},
	delim: string
) => {
	const urlParams = new URLSearchParams();
	Object.keys(params).forEach((key) => {
		urlParams.append(key, params[key]);
	});
	return `${url}${delim}${urlParams.toString()}`;
};

export const getExtensionFromFileName = (fileName: string) => {
	return fileName.split(".").pop();
};

export const blobToFile = (
	theBlob: Blob,
	fileName: string,
	lastModifiedDate?: Date
): File => {
	const b: any = theBlob;
	//A Blob() is almost a File() - it's just missing the two properties below which we will add
	b.lastModifiedDate = lastModifiedDate ?? new Date();
	b.name = fileName;

	//Cast to a File() type
	return theBlob as File;
};

export const planLimitsToNumber = (val: number | string | undefined) => {
	if (typeof val === "undefined") return undefined;
	if (val === "Unlimited") return undefined;
	if (val === "-1") return undefined;
	if (val === -1) return undefined;
	return val;
};

export const compareArrayOfObjects = (
	array1: { [key: string]: any }[],
	array2: { [key: string]: any }[]
) => {
	const array1Str = array1
		.map((obj) => JSON.stringify(obj))
		.sort()
		.join(",");
	const array2Str = array2
		.map((obj) => JSON.stringify(obj))
		.sort()
		.join(",");

	return array1Str === array2Str;
};
