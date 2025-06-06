import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { read, writeFileXLSX } from "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";

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
        .from('equipment')
        .select()
        .order('id', { ascending: true })
        receivedData = JSON.parse(JSON.stringify(data));
    } else {
        const { data, error } = await supabase
        .from('equipment')
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
                <td class="main-table-cell">${receivedData[entry].branch}</td>
                <td class="main-table-cell">${receivedData[entry].name}</td>
                <td class="main-table-cell">${receivedData[entry].inventory_number}</td>
                <td class="main-table-cell">${receivedData[entry].note.replaceAll("\n", "<br>")}</td>
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

        let inputSearchByBranch = document.getElementById("inputSearchByBranch");
        let buttonSearchByBranch = document.getElementById("buttonSearchByBranch");
        let inputSearchByName = document.getElementById("inputSearchByName");
        let buttonSearchByName = document.getElementById("buttonSearchByName");
        let inputSearchByInventoryNumber = document.getElementById("inputSearchByInventoryNumber");
        let buttonSearchByInventoryNumber = document.getElementById("buttonSearchByInventoryNumber");
        let inputSearchByNote = document.getElementById("inputSearchByNote");
        let buttonSearchByNote = document.getElementById("buttonSearchByNote");
        let buttonExport = document.getElementById("buttonExport");

        getData(false);

        buttonRefreshTable.onclick = function() {
            getData(false);
        }

        buttonAddEntry.onclick = function() {
            dialogAddEntry.showModal();
            let buttonSave = document.getElementById("buttonSave");

            buttonSave.onclick = async function() {
                let inputBranch = document.getElementById("inputBranch");
                let inputName = document.getElementById("inputName");
                let inputInventoryNumber = document.getElementById("inputInventoryNumber");
                let inputNote = document.getElementById("inputNote");

                const { error } = await supabase
                .from('equipment')
                .insert({ branch: inputBranch.value, name: inputName.value, inventory_number: inputInventoryNumber.value, note: inputNote.value });

                inputBranch.value = "";
                inputName.value = "";
                inputInventoryNumber.value = "";
                inputNote.value = "";
                
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
                let inputBranchEdit = document.getElementById("inputBranchEdit");
                let inputNameEdit = document.getElementById("inputNameEdit");
                let inputInventoryNumberEdit = document.getElementById("inputInventoryNumberEdit");
                let inputNoteEdit = document.getElementById("inputNoteEdit");

                if (inputId.disabled == false) {
                    const { data, error } = await supabase
                    .from('equipment')
                    .select()
                    .eq('id', `${inputId.value}`);
        
                    let receivedData = JSON.parse(JSON.stringify(data));
        
                    inputId.disabled = true;
                    inputBranchEdit.value = receivedData[0].branch;
                    inputNameEdit.value = receivedData[0].name;
                    inputInventoryNumberEdit.value = receivedData[0].inventory_number;
                    inputNoteEdit.value = receivedData[0].note;
        
                    inputsContainer.style.display = "block";
                    buttonGetEntry.classList.add("button-positive");
                    buttonGetEntry.innerText = "Сохранить";
                }
                else {
                    const { error } = await supabase
                    .from('equipment')
                    .update({ branch: inputBranchEdit.value, name: inputNameEdit.value, inventory_number: inputInventoryNumberEdit.value, note: inputNoteEdit.value })
                    .eq('id', inputId.value);
                    
                    inputId.disabled = false;
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
                .from('equipment')
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
                .from('equipment')
                .select('*', { count: 'exact', head: true });
            spanEntriesCount.textContent = count;
            
            setOnOutsideDialogClickListener(dialogServiceInfo);
        }

        buttonSignOut.onclick = function() {
            setCookie('signInStatus', 'unsigned', {});
            window.open("/index.html", "_self");
        }
        
        buttonSearchByBranch.onclick = function() {
            if (inputSearchByBranch.value != "") {
                getData(true, 'branch', `%${inputSearchByBranch.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonSearchByName.onclick = function() {
            if (inputSearchByName.value != "") {
                getData(true, 'name', `%${inputSearchByName.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonSearchByInventoryNumber.onclick = function() {
            if (inputSearchByInventoryNumber.value != "") {
                getData(true, 'inventory_number', `%${inputSearchByInventoryNumber.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonSearchByNote.onclick = function() {
            if (inputSearchByNote.value != "") {
                getData(true, 'note', `%${inputSearchByNote.value}%`);
            }
            else {
                getData(false);
            }
        }

        buttonExport.onclick = async function() {
            let receivedData;

            const { data, error } = await supabase
            .from('equipment')
            .select()
            .csv();
            receivedData = data;

            let csv_string = receivedData.toString().replace("id", "ID").replace("branch", "Филиал").replace("name", "Наименование").replace("inventory_number", "Инв. номер").replace("note", "Примечание");
            let xlsxFile = XLSX.read(csv_string, { type: "string" });
            XLSX.writeFileXLSX(xlsxFile, "Database.xlsx");
        }
    } else {
        window.open("/index.html", "_self");
    }
}