import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';

const supabase = createClient('https://hlapzydzkeyttgmughiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsYXB6eWR6a2V5dHRnbXVnaGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNDc4NzAsImV4cCI6MjA0NDcyMzg3MH0.fNlhkzfU5RZURQpfu1sTz4EjWL-ImWRvGNx0mMBwuE8');

async function getData(isSearch, searchColumn, searchValue) {
    let tableRow = document.getElementById("tableRow");

    let tableRows = document.getElementsByClassName("table-rows");
    while(tableRows[0]) {
        tableRows[0].parentNode.removeChild(tableRows[0]);
    }

    let receivedData;

    if (!isSearch) {
        const { data, error } = await supabase
        .from('events')
        .select()
        .order('id', { ascending: true })
        receivedData = JSON.parse(JSON.stringify(data));
    } else {
        const { data, error } = await supabase
        .from('events')
        .select()
        .order('id', { ascending: true })
        .ilike(`${searchColumn}`, `${searchValue}`);
        receivedData = JSON.parse(JSON.stringify(data));
    }

    for (let entry in receivedData) {
        tableRow.insertAdjacentHTML('beforeBegin', 
            `
            <tr class="table-rows">
                <td class="main-table-cell">${receivedData[entry].id}</td>
                <td class="main-table-cell">${receivedData[entry].title}</td>
                <td class="main-table-cell">${receivedData[entry].date}</td>
                <td class="main-table-cell">${receivedData[entry].description}</td>
                <td class="main-table-cell">${receivedData[entry].tag}</td>
            </tr>
            `);
    }
}

function setOnOutsideDialogClickListener(dialog){
	dialog.addEventListener('click', function (event) {
		let rect = dialog.getBoundingClientRect();
		let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
		  && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog) {
			dialog.close();
		}
	});
}

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

window.onload = async function() {
    
    if (getCookie('signInStatus') == 'signed') {    
        let buttonRefreshTable = document.getElementById("buttonRefreshTable");
        let buttonAddEntry = document.getElementById("buttonAddEntry");
        let buttonEditEntry = document.getElementById("buttonEditEntry");
        let buttonDeleteEntry = document.getElementById("buttonDeleteEntry");
        let buttonServiceInfo = document.getElementById("buttonServiceInfo");
        let buttonSignOut = document.getElementById("buttonSignOut");

        let dialogAddEntry = document.getElementById("dialogAddEntry");
        let dialogEditEntry = document.getElementById("dialogEditEntry");
        let dialogDeleteEntry = document.getElementById("dialogDeleteEntry");
        let dialogServiceInfo = document.getElementById("dialogServiceInfo");

        let inputSearchByTag = document.getElementById("inputSearchByTag");
        let buttonSearchByTag = document.getElementById("buttonSearchByTag");
        let inputSearchByTitle = document.getElementById("inputSearchByTitle");
        let buttonSearchByTitle = document.getElementById("buttonSearchByTitle");
        let inputSearchByDate = document.getElementById("inputSearchByDate");
        let buttonSearchByDate = document.getElementById("buttonSearchByDate");
        let inputYear = document.getElementById("inputYear");
        let buttonExport = document.getElementById("buttonExport");

        getData(false);

        buttonRefreshTable.onclick = function() {
            getData(false);
        }

        buttonAddEntry.onclick = function() {
            dialogAddEntry.showModal();
            let buttonSave = document.getElementById("buttonSave");

            buttonSave.onclick = async function() {
                let inputTitle = document.getElementById("inputTitle");
                let inputDescription = document.getElementById("inputDescription");
                let inputDate = document.getElementById("inputDate");
                let inputTag = document.getElementById("inputTag");

                const { error } = await supabase
                .from('events')
                .insert({ date: inputDate.value, description: inputDescription.value, tag: inputTag.value, title: inputTitle.value });

                inputTitle.value = "";
                inputDescription.value = "";
                inputDate.value = "";
                inputTag.value = "";
                
                dialogAddEntry.close();
                getData(false);
            }
            setOnOutsideDialogClickListener(dialogAddEntry);
        }

        buttonEditEntry.onclick = function() {
            dialogEditEntry.showModal();

            let inputId = document.getElementById("inputId");
            let buttonGetEntry = document.getElementById("buttonGetEntry");
            let inputsContainer = document.getElementById("inputsContainer");

            buttonGetEntry.onclick = async function() {
                let inputTitleEdit = document.getElementById("inputTitleEdit");
                let inputDescriptionEdit = document.getElementById("inputDescriptionEdit");
                let inputDateEdit = document.getElementById("inputDateEdit");
                let inputTagEdit = document.getElementById("inputTagEdit");

                if (inputId.disabled == false) {
                    const { data, error } = await supabase
                    .from('events')
                    .select()
                    .eq('id', `${inputId.value}`);
        
                    let receivedData = JSON.parse(JSON.stringify(data));

                    if (receivedData.length > 0) {
                        inputId.disabled = true;
                        inputTitleEdit.value = receivedData[0].title;
                        inputDescriptionEdit.value = receivedData[0].description;
                        inputDateEdit.value = receivedData[0].date;
                        inputTagEdit.value = receivedData[0].tag;
            
                        inputsContainer.style.display = "block";
                        buttonGetEntry.classList.add("button-positive");
                        buttonGetEntry.innerText = "Сохранить";
                    }
                }
                else {
                    const { error } = await supabase
                    .from('events')
                    .update({ date: inputDateEdit.value, description: inputDescriptionEdit.value, tag: inputTagEdit.value, title: inputTitleEdit.value })
                    .eq('id', inputId.value);
                    
                    inputId.disabled = false;
                    inputId.value = "";
                    inputsContainer.style.display = "none";
                    buttonGetEntry.classList.remove("button-positive");
                    buttonGetEntry.innerText = "Получить данные";
                    dialogEditEntry.close();
                    getData(false);
                }
            }
            setOnOutsideDialogClickListener(dialogEditEntry);
        }

        buttonDeleteEntry.onclick = function() {
            dialogDeleteEntry.showModal();

            let inputDeleteById = document.getElementById("inputDeleteById");
            let buttonDeleteEntryById = document.getElementById("buttonDeleteEntryById");

            buttonDeleteEntryById.onclick = async function() {
                const response = await supabase
                .from('events')
                .delete()
                .eq('id', inputDeleteById.value);

                inputDeleteById.value = "";
                dialogDeleteEntry.close();
                getData(false);
            }
            setOnOutsideDialogClickListener(dialogDeleteEntry);
        }

        buttonServiceInfo.onclick = async function() {
            dialogServiceInfo.showModal();

            let spanEntriesCount = document.getElementById("spanEntriesCount");

            const { count } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true });
            spanEntriesCount.textContent = count;
            
            setOnOutsideDialogClickListener(dialogServiceInfo);
        }

        buttonSignOut.onclick = function() {
            setCookie('signInStatus', 'unsigned', {});
            window.open("/index.html", "_self");
        }

        buttonSearchByTag.onclick = function() {
            if (inputSearchByTag.value != "") {
                getData(true, 'tag', `%${inputSearchByTag.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonSearchByTitle.onclick = function() {
            if (inputSearchByTitle.value != "") {
                getData(true, 'title', `%${inputSearchByTitle.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonSearchByDate.onclick = function() {
            if (inputSearchByDate.value != "") {
                getData(true, 'date', `%${inputSearchByDate.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonExport.onclick = async function() {
            let receivedData;

            if (inputYear.value != "") {
                const { data, error } = await supabase
                .from('events')
                .select()
                .ilike('date', `%${inputYear.value}%`)
                .csv();
                receivedData = JSON.parse(JSON.stringify(data));
            }
            else {
                const { data, error } = await supabase
                .from('events')
                .select()
                .csv();
                receivedData = data;
            }

            let csv_string = receivedData.toString().replace("id", "ID").replace("date", "Дата").replace("description", "Описание").replace("tag", "Тег").replace("title", "Название");
            let xlsxFile = XLSX.read(csv_string, { type: "string" });
            XLSX.writeFileXLSX(xlsxFile, "Database.xlsx");
        }
    } else {
        window.open("/index.html", "_self");
    }
}