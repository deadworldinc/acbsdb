import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://hlapzydzkeyttgmughiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsYXB6eWR6a2V5dHRnbXVnaGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNDc4NzAsImV4cCI6MjA0NDcyMzg3MH0.fNlhkzfU5RZURQpfu1sTz4EjWL-ImWRvGNx0mMBwuE8');

function setCookie(name, value, options = {}) {
	options = {
		path: '/',
		expires: 'Tue, 19 Jan 2038 03:14:07 GMT',
		...options
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
			updatedCookie += "; " + optionKey;
			let optionValue = options[optionKey];
			if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
	  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

window.onload = function() {
	if (getCookie('signInStatus') == 'signed') {
		window.open("tables.html", "_self");
	} else {
		setCookie('signInStatus', 'unsigned', {});
	}

    let inputLogin = document.getElementById("inputLogin");
    let inputPassword = document.getElementById("inputPassword");
    let buttonLogin = document.getElementById("buttonLogin");

    buttonLogin.onclick = async function() {
        const { data, error } = await supabase
        .from('users')
        .select('password')
        .eq('login', `${inputLogin.value}`);

        let receivedPassword = JSON.parse(JSON.stringify(data[0])).password;
        
        if(inputPassword.value == receivedPassword) {
            setCookie('signInStatus', 'signed', {});
			window.open("tables.html", "_self");
        }
        else {
            setCookie('signInStatus', 'unsigned', {});
        }

        console.log(receivedPassword);
    }
		
	let descriptionsContainer = document.getElementById("descriptionsContainer");
	let descriptionsContainerClickCounter = 0;
	let menuInner = document.getElementById("menuInner");
	let websiteInfo = document.getElementById("websiteInfo");

	descriptionsContainer.onclick = function() {
        descriptionsContainerClickCounter++;
        if(descriptionsContainerClickCounter == 10) {
			menuInner.classList.add("menu-inner-animation");
			websiteInfo.classList.add("website-info-animation");
        }
    }
}