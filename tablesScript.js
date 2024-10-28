import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://hlapzydzkeyttgmughiu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsYXB6eWR6a2V5dHRnbXVnaGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNDc4NzAsImV4cCI6MjA0NDcyMzg3MH0.fNlhkzfU5RZURQpfu1sTz4EjWL-ImWRvGNx0mMBwuE8');

window.onload = async function() {
    getData();

    let buttonRefreshTable = document.getElementById("buttonRefreshTable");

    buttonRefreshTable.onclick = function() {
        getData();
    }
}

async function getData() {
    let tableBody = document.getElementById("tableBody");

    const { data, error } = await supabase
    .from('events')
    .select()

    let receivedData = JSON.parse(JSON.stringify(data));

    console.log(receivedData[0]);

    for (let entry in receivedData) {
        console.log(receivedData[entry].title);
        tableBody.insertAdjacentHTML('beforeBegin', 
            `
            <tr>
                <td class="main-table-cell">${receivedData[entry].id}</td>
                <td class="main-table-cell">${receivedData[entry].title}</td>
                <td class="main-table-cell">${new Date(Date.parse(receivedData[entry].date)).toLocaleDateString("ru-RU")}</td>
                <td class="main-table-cell">${receivedData[entry].description}</td>
                <td class="main-table-cell">${receivedData[entry].tag}</td>
            </tr>
            `);
    }
}