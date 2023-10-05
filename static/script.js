
let states = []
forward = 0

class Tabler {
    constructor(tableId, table_fields) {
        this.table = document.getElementById(tableId);
        this.setTableHeaders(table_fields); // Set the table headers using table_fields
    }

    setTableHeaders(table_fields) {
        const headerRow = this.table.insertRow(0);
        table_fields.forEach(field => {
            const headerCell = document.createElement("th");
            headerCell.innerHTML = "<pre>" + field + "</pre>";
            headerRow.appendChild(headerCell);
        });
    }

    addRow(rowData) {
        if (rowData.length !== this.table.rows[0].cells.length) {
            throw new Error("Number of columns in the row must match the number of table headers.");
        }

        const row = this.table.insertRow(this.table.rows.length);
        rowData.forEach(data => {
            const cell = row.insertCell();
            //console.log(data);
            //console.log(typeof data);
            if (Array.isArray(data)) {
                // If data is a string, add a <pre> tag
                let num_keyed_object = 0
                data.forEach(dat => {
                    if (typeof dat === 'object' && dat !== null && Object.keys(dat).length >= 0) {
                        num_keyed_object++
                    }
                })


                // If data is not a string, add a button
                const button = document.createElement('button');
                button.innerText = '[...]'; // You can customize the button text

                button.addEventListener('click', () => {
                    this.clearTable()
                    if (num_keyed_object == data.length) {
                        tablize(data)
                    }
                    else {
                        tablize([data])
                    }
                    forward++

                });


                cell.appendChild(button);
            }

            else if (typeof data === 'object' && data !== null && Object.keys(data).length >= 0) {
                const button = document.createElement('button');
                button.innerText = '[...]'; // You can customize the button text

                button.addEventListener('click', () => {
                    this.clearTable()
                    tablize([data])
                    forward++
                });


                cell.appendChild(button);
            }

            else {
                if (typeof data === 'string') {
                    if (data != null & data.startsWith("http://") || data.startsWith("https://")) {
                        data = data.toString()
                        cell.innerHTML = `<pre><a href="${data}" target="_blank">${data}</a></pre>`;
                    } else {
                        cell.innerHTML = "<pre>" + data + "</pre>";
                    }
                }

                else {
                    cell.innerHTML = "<pre>" + data + "</pre>";
                }



            }

        });
    }


    clearTable() {
        // Remove all rows except the header row
        while (this.table.rows.length > 0) {
            this.table.deleteRow(0);
        }
    }

}


let table



function tablize(info) {

    states.push(info)


    // Create an empty array to store fields
    let fields = [];

    // Iterate through the 'info' array
    for (const master of info) {
        // Iterate through the keys of the 'master' object
        for (const key in master) {
            if (!fields.includes(key)) {
                fields.push(key);
            }
        }
    }

    // Create a PrettyTable object
    table = new Tabler("tab", fields);

    // Iterate through the 'info' array again
    for (const master of info) {
        let new_vals = [];

        // Iterate through the fields
        for (const f of fields) {
            let val;

            // Check if the field exists in the 'master' object
            if (master.hasOwnProperty(f)) {
                val = master[f];
            } else {
                val = '';
            }


            new_vals.push(val);

        }

        table.addRow(new_vals);
    }


}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Get the "url" parameter values
const urlValues = urlParams.getAll('url');

// Construct the new URL with the parameters
const url = `/server_route?url=${urlValues.join('&url=')}`;

// Make a GET request using the fetch function
document.getElementById("bck").innerHTML = "Fetching Data...";
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json(); // Assuming the response contains JSON data
    })
    .then(data => {
        // Handle the JSON data here

        tablize(data)
        document.getElementById("bck").innerHTML = "Back";
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
        document.getElementById("bck").innerHTML = error

    });


function goBack() {

    table.clearTable()
    try {
        tablize(states[forward - 1])
    }
    catch (error) {
        window.location.href = "/";
    }
    states.pop()
    forward--

}



