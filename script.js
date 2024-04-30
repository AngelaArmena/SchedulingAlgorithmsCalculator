function dropdownOpen() {
    var dropdown = document.getElementById("dropdown");
    var selectedAlgorithm = dropdown.options[dropdown.selectedIndex].text;
    var timeQuantumBox = document.getElementById("timeQuantum");

    // Show or hide the timeQuantum box based on the selected algorithm
    if (selectedAlgorithm === "Round Robin") {
        removePriorityColumn();
        timeQuantumBox.style.display = "block";
    }
    else if (selectedAlgorithm === "Priority") {
        timeQuantumBox.style.display = "none";
        console.log('priority');
        var table = document.getElementById("processTable");
        var btCell = table.querySelector("thead th:nth-child(1)");
        var insertionIndex = btCell.cellIndex;

        var priorityCell = document.createElement("th");
        priorityCell.textContent = "Priority";
        table.querySelectorAll("thead tr th")[insertionIndex].insertAdjacentElement('afterend', priorityCell);

        var rows = table.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            var priorityDataCell = document.createElement("td");
            var input = document.createElement("input");
            input.type = "number";
            input.className = "number numTable priority";
            priorityDataCell.appendChild(input);
            var targetCell = row.querySelectorAll("td")[insertionIndex];
            targetCell.insertAdjacentElement('afterend', priorityDataCell);
        });

        // Add event listeners to the new priority input fields
        var priorityInputs = document.querySelectorAll(".priority");
        priorityInputs.forEach(function (input) {
            input.addEventListener("input", updateSolveButtonState);
        });

        // Call updateSolveButtonState to ensure button state is updated
        updateSolveButtonState();
    }
    else {
        removePriorityColumn();
        timeQuantumBox.style.display = "none";
    }
}
function toggleIOBurst() {
    var ioCheckbox = document.getElementById("ioCheckbox");
    var ioBurst = document.getElementById("ioBurst");

    // Show or hide the I/O Burst box based on the checkbox state
    ioBurst.style.display = ioCheckbox.checked ? "block" : "none";

    // If the checkbox is unchecked, remove I/O Burst columns
    if (ioCheckbox.checked) {
        generateIoBurstColumns();
    }
    else if (!ioCheckbox.checked) {
        removeIoBurstColumns();
    }
}

function maxInput(input) {
    // Regular expression to match only "1" or "2"
    var regex = /^[12]$/;
    var value = input.value;

    if (value.length > 1 || (value.length === 1 && !regex.test(value))) {
        // If the input contains more than one character or the single character is not "1" or "2",
        // remove the last character entered
        input.value = value.slice(0, -1);
    }
}

// Function to dynamically generate table rows based on the number of processes
function generateTableRows() {
    var numProcesses = parseInt(document.getElementById("numProcesses").value);
    var table = document.getElementById("processTable");
    var tableBody = table.getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear existing rows

    for (var i = 1; i <= numProcesses; i++) {
        var row = tableBody.insertRow();
        var processCell = row.insertCell(0);
        var arrivalCell = row.insertCell(1);
        var burstCell = row.insertCell(2);
        var completionCell = row.insertCell(3);
        var turnaroundCell = row.insertCell(4);
        var waitingCell = row.insertCell(5);
        var responseCell = row.insertCell(6);

        processCell.innerHTML = "P" + i;
        arrivalCell.innerHTML = "<input type='number' class='number numTable AT'>";
        burstCell.innerHTML = "<input type='number' class='number numTable CPU'>";
        completionCell.innerHTML = "";
        turnaroundCell.innerHTML = "";
        waitingCell.innerHTML = "";
        responseCell.innerHTML = "";
    }

    table.style.display = "block"; // Show the table
}

// Add event listener to the "Number of Processes" input field
document.getElementById("numProcesses").addEventListener("input", generateTableRows);

// Call generateTableRows initially with the default value of 2
generateTableRows();


//IO BURST TIME
function generateIoBurstColumns() {
    removeIoBurstColumns();
    var numIoBursts = parseInt(document.getElementById("numIoBurst").value);
    var numIO = document.getElementById("numIoBurst").value;
    var table = document.getElementById("processTable");

    // Find the index of the "Burst Time" column
    var btColumnIndex = Array.from(table.querySelector("thead").querySelectorAll("th")).findIndex(th => th.textContent === "BT");

    var btCell = table.querySelector("thead th:nth-child(3)");
    if (numIO.length === 1) {
        btCell.textContent = "CPU";
    }
    else {
        btCell.textContent = "BT";
    }

    // Insert additional columns for each I/O burst between "Burst Time" and "Completion Time"
    for (var i = 1; i <= numIoBursts; i++) {
        var ioBurstCell = document.createElement("th");
        ioBurstCell.textContent = "I/O";
        var insertionIndex = btColumnIndex;
        table.querySelectorAll("thead tr th")[insertionIndex].insertAdjacentElement('afterend', ioBurstCell);

        var ioBurstCell = document.createElement("th");
        ioBurstCell.textContent = "CPU";
        table.querySelectorAll("thead tr th")[insertionIndex + 1].insertAdjacentElement('afterend', ioBurstCell);

        // Insert additional data cells for each I/O burst between "Burst Time" and "Completion Time"
        var rows = table.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            var ioBurstDataCell = document.createElement("td");
            var input = document.createElement("input");
            input.type = "number";
            input.className = "number numTable CPU";
            ioBurstDataCell.appendChild(input);
            var targetCell = row.querySelectorAll("td")[insertionIndex - 1];
            targetCell.insertAdjacentElement('afterend', ioBurstDataCell);

            var ioBurstDataCell = document.createElement("td");
            var input = document.createElement("input");
            input.type = "number";
            input.className = "number numTable IO";
            ioBurstDataCell.appendChild(input);
            var targetCell = row.querySelectorAll("td")[insertionIndex];
            targetCell.insertAdjacentElement('afterend', ioBurstDataCell);
        });
    }

    // Clear all input values
    var allInputs = document.querySelectorAll(".numTable");
    allInputs.forEach(function (input) {
        input.value = "";
    });
}

// Function to remove I/O Burst columns from the table
function removeIoBurstColumns() {
    var table = document.getElementById("processTable");

    var btCell = table.querySelector("thead th:nth-child(3)");
    btCell.textContent = "BT";

    // Find and remove all the I/O Burst columns from the table header
    var ioBurstHeaderCells = table.querySelectorAll("thead th");
    ioBurstHeaderCells.forEach(function (cell) {
        if (cell.textContent.startsWith("I/O") || cell.textContent.startsWith("CPU")) {
            var index = cell.cellIndex; // Get the index of the header cell
            cell.remove();

            // Remove the corresponding data cells in the body
            var ioBurstDataCells = table.querySelectorAll("tbody td:nth-child(" + (index + 1) + ")");
            ioBurstDataCells.forEach(function (dataCell) {
                dataCell.remove();
            });
        }
    });
}

function removePriorityColumn() {
    var table = document.getElementById("processTable");
    // Find and remove all the I/O Burst columns from the table header
    var ioBurstHeaderCells = table.querySelectorAll("thead th");
    ioBurstHeaderCells.forEach(function (cell) {
        if (cell.textContent.startsWith("Priority")) {
            var index = cell.cellIndex; // Get the index of the header cell
            cell.remove();

            // Remove the corresponding data cells in the body
            var ioBurstDataCells = table.querySelectorAll("tbody td:nth-child(" + (index + 1) + ")");
            ioBurstDataCells.forEach(function (dataCell) {
                dataCell.remove();
            });
        }
    });
}

// Add event listener to the "Number of I/O Bursts" input field
document.getElementById("numIoBurst").addEventListener("input", generateIoBurstColumns);

var completionTime = [];
var turnaroundTime = [];
var waitingTime = [];
var responseTime = [];

function solve() {
    var dropdown = document.getElementById("dropdown");
    var selectedAlgorithm = dropdown.options[dropdown.selectedIndex].text;
    console.log(selectedAlgorithm);

    // Get the values from the input fields
    var inputsAT = document.querySelectorAll(".numTable.AT");
    var inputsCPU = document.querySelectorAll(".numTable.CPU");
    var inputsIO = document.querySelectorAll(".numTable.IO");

    var switchTime = parseInt(document.getElementById("numSwitchTime").value);

    var valuesAT = [];
    var valuesCPU = [];
    var valuesIO = [];

    completionTime = [];
    turnaroundTime = [];
    waitingTime = [];
    responseTime = [];

    inputsAT.forEach(function (input) { valuesAT.push(input.value); });

    // Check if valuesCPU has 2x more elements than valuesAT
    if (inputsCPU.length === 2 * inputsAT.length) {
        var firstCPU = [];
        var secondCPU = [];
        Array.from(inputsCPU).forEach(function (input, index) {
            if (index % 2 === 0) {
                firstCPU.push(input.value);
            } else {
                secondCPU.push(input.value);
            }
        });
        valuesCPU.push([firstCPU], [secondCPU]);

        inputsIO.forEach(function (input) { valuesIO.push(input.value); });
    }
    else if (inputsCPU.length === 3 * inputsAT.length) {
        var firstCPU = [];
        var secondCPU = [];
        var thirdCPU = [];
        Array.from(inputsCPU).forEach(function (input, index) {
            if (index % 3 === 0) {
                firstCPU.push(input.value);
            } else if (index % 3 === 1) {
                secondCPU.push(input.value);
            } else {
                thirdCPU.push(input.value);
            }
        });
        valuesCPU.push([firstCPU], [secondCPU], [thirdCPU]);

        var firstIO = [];
        var secondIO = [];
        Array.from(inputsIO).forEach(function (input, index) {
            if (index % 2 === 0) {
                firstIO.push(input.value);
            } else {
                secondIO.push(input.value);
            }
        });
        valuesIO.push([firstIO], [secondIO]);
    }
    else {
        inputsCPU.forEach(function (input) { valuesCPU.push(input.value); });
    }

    console.log("Arrival Time: ", JSON.stringify(valuesAT));
    console.log("Burst Time", JSON.stringify(valuesCPU));
    console.log(JSON.stringify(valuesIO));

    if (selectedAlgorithm === "First Come First Serve") {

    }
    else if (selectedAlgorithm === "Shortest Job First") {

    }
    else if (selectedAlgorithm === "Shortest Remaining Time First") {

    }
    else if (selectedAlgorithm === "Round Robin") {
        var timeQuantum = parseInt(document.getElementById("numTimeQuantum").value);
        roundRobin(valuesAT, valuesCPU, timeQuantum, switchTime);

        displayTable(valuesAT, valuesCPU, completionTime, turnaroundTime, waitingTime, responseTime)
    }
    else if (selectedAlgorithm === "Priority") {

    }
}

function roundRobin(arrivalTime, burstTime, timeQuantum, switchTime) {
    var n = arrivalTime.length;
    var remainingTime = Array.from(burstTime);
    var currentTime = 0;
    var completed = 0;

    // Create a queue sorted based on arrival time
    var queue = [];
    for (var i = 0; i < n; i++) {
        queue.push(i);
    }
    queue.sort((a, b) => arrivalTime[a] - arrivalTime[b]);

    console.log("Initial Queue: ", queue);

    while (completed < n) {
        var processIndex = queue[0]; // Process at index 0 of the queue
        if (remainingTime[processIndex] > 0) {
            if (parseInt(arrivalTime[processIndex]) <= currentTime) {
                if (responseTime[processIndex] === undefined) {
                    responseTime[processIndex] = currentTime - parseInt(arrivalTime[processIndex]);
                }
                var executeTime = Math.min(remainingTime[processIndex], timeQuantum); // Calculate time to execute this time quantum
                currentTime += executeTime; // Increment current time
                remainingTime[processIndex] -= executeTime; // Decrease remaining time for the process

                if (remainingTime[processIndex] === 0) {
                    completionTime[processIndex] = currentTime; // Process completes execution
                    turnaroundTime[processIndex] = completionTime[processIndex] - parseInt(arrivalTime[processIndex]); // Calculate turnaround time
                    waitingTime[processIndex] = turnaroundTime[processIndex] - parseInt(burstTime[processIndex]); // Calculate waiting time
                    completed++; // Increment completed count
                    // Remove completed process from the queue
                    queue.shift();
                }

                // Update the queue after every time quantum
                if (remainingTime[processIndex] > 0) {
                    // Find the index of the first process that has not yet arrived
                    var indexToInsert = 0;
                    while (indexToInsert < queue.length && arrivalTime[queue[indexToInsert]] <= currentTime) {
                        indexToInsert++;
                    }
                    // Insert the executed process before the first process that has not yet arrived
                    queue.splice(indexToInsert - 1, 0, queue.shift());
                }

                currentTime += switchTime;
            }
            else {
                currentTime++;
            }
        }
        console.log("Updated Queue: ", queue); // Print the updated queue
    }
}

function displayTable(valuesAT, valuesCPU, completionTime, turnaroundTime, waitingTime, responseTime) {
    var tableBody = document.querySelector("#processTable tbody");
    
    // Clear existing rows
    tableBody.innerHTML = "";

    for (var i = 0; i < valuesAT.length; i++) {
        var row = tableBody.insertRow();
        var cellProcess = row.insertCell(0);
        var cellAT = row.insertCell(1);
        var cellBT = row.insertCell(2);
        var cellCT = row.insertCell(3);
        var cellTAT = row.insertCell(4);
        var cellWT = row.insertCell(5);
        var cellRT = row.insertCell(6);

        cellProcess.textContent = "P" + (i + 1);
        // Retain the textbox for Arrival Time
        var inputAT = document.createElement('input');
        inputAT.type = 'number';
        inputAT.className = 'number numTable AT';
        inputAT.value = valuesAT[i];
        cellAT.appendChild(inputAT);

        // Retain the textbox for Burst Time
        var inputBT = document.createElement('input');
        inputBT.type = 'number';
        inputBT.className = 'number numTable CPU';
        inputBT.value = valuesCPU[i];
        cellBT.appendChild(inputBT);

        cellCT.textContent = completionTime[i];
        cellTAT.textContent = turnaroundTime[i];
        cellWT.textContent = waitingTime[i];
        cellRT.textContent = responseTime[i];
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to the dropdown select element
    document.getElementById("dropdown").addEventListener("change", updateSolveButtonState);

    //Add event listeners to the Time Quantum input field
    document.getElementById("numTimeQuantum").addEventListener("input", updateSolveButtonState);

    // Add event listeners to all input fields in the table
    var inputs = document.querySelectorAll(".numTable");
    inputs.forEach(function (input) {
        input.addEventListener("input", updateSolveButtonState);
    });

    // Call the function initially to set the initial state of the "SOLVE" button
    updateSolveButtonState();
});

function updateSolveButtonState() {
    var dropdown = document.getElementById("dropdown");
    var selectedAlgorithm = dropdown.options[dropdown.selectedIndex].text;

    // Check if an algorithm is chosen
    var algorithmChosen = selectedAlgorithm !== "---Choose algorithm---";

    // Check if all textboxes in the table are populated
    var allTextboxesPopulated = areAllTextboxesPopulated();
    var timeQuantumPopulatedValue = timeQuantumPopulated(selectedAlgorithm);

    // Enable the "SOLVE" button if both conditions are met, otherwise disable it
    var solveButton = document.querySelector(".btnSolve");
    solveButton.disabled = !(algorithmChosen && allTextboxesPopulated);
    solveButton.disabled = !(algorithmChosen && allTextboxesPopulated && timeQuantumPopulatedValue);
}

function timeQuantumPopulated(selectedAlgorithm) {
    var isInput = document.getElementById("numTimeQuantum");
    var isPopulated = true;
    if (selectedAlgorithm === "Round Robin") {
        if (isInput.value === "") {
            isPopulated = false;
        }
    }
    return isPopulated;
}

function areAllTextboxesPopulated() {
    var inputs = document.querySelectorAll(".numTable");
    var allPopulated = true;
    inputs.forEach(function (input) {
        if (input.value === "") {
            allPopulated = false;
        }
    });
    return allPopulated;
}