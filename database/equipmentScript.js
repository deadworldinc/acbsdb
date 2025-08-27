import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';

const supabase = createClient('https://hlapzydzkeyttgmughiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsYXB6eWR6a2V5dHRnbXVnaGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNDc4NzAsImV4cCI6MjA0NDcyMzg3MH0.fNlhkzfU5RZURQpfu1sTz4EjWL-ImWRvGNx0mMBwuE8');

let conversion;
let docDefinition;

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
                <td class="main-table-cell">${receivedData[entry].responsible_person}</td>
                <td class="main-table-cell">${receivedData[entry].name}</td>
                <td class="main-table-cell">${receivedData[entry].inventory_number}</td>
                <td class="main-table-cell">${receivedData[entry].amount} руб.</td>
                <td class="main-table-cell">${receivedData[entry].quantity} шт.</td>
            </tr>
            `);
    }

    let tableEntries = document.querySelectorAll(".main-table-cell");
    for (let i = 0; i < tableEntries.length; i++) {
        let tableEntry = tableEntries[i];
        tableEntry.ondblclick = function() {
            console.log(tableEntry.parentElement.getElementsByClassName("main-table-cell")[0].textContent);
        }        
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

function generatePDF() {
    conversion = htmlToPdfmake(
    `
        <div> 
            <p style="text-align: center; font-size: 18px;"><strong>Муниципальное бюджетное учреждение города Абакана<br>«Абаканская централизованная библиотечная система»</strong></p>
            <span style="font-size: 14px;">
                Отчет, содержащий сведения о компьютерном оборудовании библиотек-филиалов Абаканской централизованной библиотечной системы.
                <br><br>Отчет составлен <span style="font-weight: bold;">${new Date().toLocaleDateString()}</span> в 
                <span style="font-weight: bold;">${new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"})}</span>
                на основе информации, содержащейся в базе данных оборудования ЦБС.
            </span>
            ${document.getElementsByClassName("right-main-container")[0].getHTML()
                .replaceAll('<span class="sorttable-label" id="sorttable_sortrevind">ASC</span>', '')
                .replaceAll('<span class="sorttable-label" id="sorttable_sortfwdind">DESC</span>', '')
                .replaceAll('class="main-table-cell"', 'class="main-table-cell" style="padding: 5px; font-size: 14px; text-align: center; vertical-align: baseline;"')
                .replaceAll('class="table-header-title"', 'class="table-header-title" style="background-color: #f5f5f5; padding: 5px; font-size: 14px; text-align: center; vertical-align: baseline;"')
                .replaceAll('class="table-header-title sorttable_sorted"', 'class="table-header-title" style="background-color: #f5f5f5; padding: 5px; font-size: 14px; text-align: center; vertical-align: baseline;"')
                .replaceAll('class="table-header-title sorttable_sorted_reverse"', 'class="table-header-title" style="background-color: #f5f5f5; padding: 5px; font-size: 14px; text-align: center; vertical-align: baseline;"')
            }
            <span style="font-size: 10px; text-align: center;">
                acbsdb.ru • ${new Date().toLocaleDateString()} • ${new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"})}
            </span> 
        </div> 
    `);
    docDefinition = { 
        pageOrientation: "landscape",
        footer: (currentPage, pageCount) => {
            var t = {
                layout: "noBorders",
                fontSize: 10,
                margin: [375, 0, 0, 0],
                table: {
                body: [
                    [
                    { text: "Страница " + currentPage.toString() + " из " + pageCount },
                    ]
                ]
                }
            };
            return t;
        },
        content : conversion 
    };
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
        let buttonExportXLSX = document.getElementById("buttonExportXLSX");
        let buttonExportPDF = document.getElementById("buttonExportPDF");
        let buttonPrintPDF = document.getElementById("buttonPrintPDF");

        getData(false);

        buttonRefreshTable.onclick = function() {
            getData(false);
        }

        buttonAddEntry.onclick = function() {
            dialogAddEntry.showModal();
            let buttonSave = document.getElementById("buttonSave");

            buttonSave.onclick = async function() {
                let inputBranch = document.getElementById("inputBranch");
                let inputResponsiblePerson = document.getElementById("inputResponsiblePerson");
                let inputName = document.getElementById("inputName");
                let inputInventoryNumber = document.getElementById("inputInventoryNumber");
                let inputAmount = document.getElementById("inputAmount");
                let inputQuantity = document.getElementById("inputQuantity");

                const { error } = await supabase
                .from('equipment')
                .insert(
                    { 
                        branch: inputBranch.value, 
                        responsible_person: inputResponsiblePerson.value,
                        name: inputName.value, 
                        inventory_number: inputInventoryNumber.value, 
                        amount: inputAmount.value,
                        quantity: inputQuantity.value
                    }
                );

                inputBranch.value = "";
                inputResponsiblePerson.value = "";
                inputName.value = "";
                inputInventoryNumber.value = "";
                inputAmount.value = "";
                inputQuantity.value = "";
                
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
                let inputResponsiblePersonEdit = document.getElementById("inputResponsiblePersonEdit");
                let inputNameEdit = document.getElementById("inputNameEdit");
                let inputInventoryNumberEdit = document.getElementById("inputInventoryNumberEdit");
                let inputAmountEdit = document.getElementById("inputAmountEdit");
                let inputQuantityEdit = document.getElementById("inputQuantityEdit");

                if (inputId.disabled == false) {
                    const { data, error } = await supabase
                    .from('equipment')
                    .select()
                    .eq('id', `${inputId.value}`);
        
                    let receivedData = JSON.parse(JSON.stringify(data));

                    if (receivedData.length > 0) {
                        inputId.disabled = true;
                        inputBranchEdit.value = receivedData[0].branch;
                        inputResponsiblePersonEdit.value = receivedData[0].responsible_person;
                        inputNameEdit.value = receivedData[0].name;
                        inputInventoryNumberEdit.value = receivedData[0].inventory_number;
                        inputAmountEdit.value = receivedData[0].amount;
                        inputQuantityEdit.value = receivedData[0].quantity;
            
                        inputsContainer.style.display = "block";
                        buttonGetEntry.innerText = "Сохранить";
                    }
                }
                else {
                    const { error } = await supabase
                    .from('equipment')
                    .update(
                        { 
                            branch: inputBranchEdit.value, 
                            responsible_person: inputResponsiblePersonEdit.value,
                            name: inputNameEdit.value, 
                            inventory_number: inputInventoryNumberEdit.value, 
                            amount: inputAmountEdit.value,
                            quantity: inputQuantityEdit.value
                        }
                    )
                    .eq('id', inputId.value);
                    
                    inputId.disabled = false;
                    inputId.value = "";
                    inputsContainer.style.display = "none";
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

        buttonExportXLSX.onclick = async function() {
            let receivedData;

            const { data, error } = await supabase
            .from('equipment')
            .select()
            .csv();
            receivedData = data;

            let csv_string = receivedData.toString()
                .replace("id", "ID")
                .replace("branch", "Филиал")
                .replace("name", "Наименование")
                .replace("inventory_number", "Инв. номер")
                .replace("responsible_person", "Отв. лицо")
                .replace("amount", "Сумма")
                .replace("quantity", "Кол-во");
            let xlsxFile = XLSX.read(csv_string, { type: "string" });
            XLSX.writeFileXLSX(xlsxFile, "Equipment.xlsx");
        }

        buttonExportPDF.onclick = function() {
            generatePDF();
            pdfMake.createPdf(docDefinition).download('Equipment.pdf');
        }

        buttonPrintPDF.onclick = function() {
            generatePDF();
            pdfMake.createPdf(docDefinition).print();
        }
    } else {
        window.open("/index.html", "_self");
    }
}