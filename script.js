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

function solve() {
    var dropdown = document.getElementById("dropdown");
    var selectedAlgorithm = dropdown.options[dropdown.selectedIndex].text;
    console.log(selectedAlgorithm);

    // Get the values from the input fields
    var inputsAT = document.querySelectorAll(".numTable.AT");
    var inputsCPU = document.querySelectorAll(".numTable.CPU");
    var inputsIO = document.querySelectorAll(".numTable.IO");

    var valuesAT = [];
    var valuesCPU = [];
    var valuesIO = [];

    var completionTime = [];
    var turnaroundTime = [];
    var waitingTime = [];
    var responseTime = [];

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

    console.log(JSON.stringify(valuesAT));
    console.log(JSON.stringify(valuesCPU));
    console.log(JSON.stringify(valuesIO));

    if (selectedAlgorithm === "First Come First Serve") {

    }
    else if (selectedAlgorithm === "Shortest Job First") {

    }
    else if (selectedAlgorithm === "Shortest Remaining Time First") {

    }
    else if (selectedAlgorithm === "Round Robin") {
        var timeQuantum = parseInt(document.getElementById("numTimeQuantum").value);
        var solvedProcessesInfo = roundRobin(valuesAT, valuesCPU, timeQuantum);

        // Calculate completion time, turnaround time, and waiting time
        var completionTime = [];
        var turnaroundTime = [];
        var waitingTime = [];

        for (var i = 0; i < valuesAT.length; i++) {
            completionTime[i + 1] = solvedProcessesInfo[i].ft;
            turnaroundTime[i + 1] = solvedProcessesInfo[i].tat;
            waitingTime[i + 1] = solvedProcessesInfo[i].wat;
        }

        completionTime = solvedProcessesInfo.map(process => process.ct);
        turnaroundTime = solvedProcessesInfo.map(process => process.tat);
        waitingTime = solvedProcessesInfo.map(process => process.wat);
        responseTime = solvedProcessesInfo.map(process => process.rt);

        console.log("Completion Time: ", completionTime);
        console.log("Turnaround Time: ", turnaroundTime);
        console.log("Waiting Time: ", waitingTime);
        console.log("Response Time: ", responseTime);

        displayTable(valuesAT, valuesCPU, completionTime, turnaroundTime, waitingTime, responseTime)
    }
    else if (selectedAlgorithm === "Priority") {

    }
}

function roundRobin(arrivalTime, burstTime, timeQuantum) {
    var n = arrivalTime.length;
    var remainingTime = Array.from(burstTime);
    var currentTime = 0;
    var completed = 0;
    var waitingTime = Array(n).fill(0);
    var turnaroundTime = Array(n).fill(0);
    var completionTime = Array(n).fill(0);
    var responseTime = Array(n).fill(-1); // -1 indicates not yet started
    
    while (completed < n) {
        var done = true; // Flag to check if a process is completed in this time slice
        for (var i = 0; i < n; i++) {
            if (remainingTime[i] > 0) {
                if (parseInt(arrivalTime[i]) <= currentTime) {
                    if (responseTime[i] === -1) {
                        responseTime[i] = currentTime - parseInt(arrivalTime[i]);
                    }
                    var executeTime = Math.min(remainingTime[i], timeQuantum); // Calculate time to execute this iteration
                    currentTime += executeTime; // Increment current time
                    remainingTime[i] -= executeTime; // Decrease remaining time for the process
                    
                    if (remainingTime[i] === 0) {
                        completionTime[i] = currentTime; // Process completes execution
                        turnaroundTime[i] = completionTime[i] - parseInt(arrivalTime[i]); // Calculate turnaround time
                        waitingTime[i] = turnaroundTime[i] - parseInt(burstTime[i]); // Calculate waiting time
                        completed++; // Increment completed count
                    } else {
                        done = false; // There are still processes to execute in this time slice
                    }
                }
            }
        }
        if (done) {
            currentTime++; // No process executed in this time slice (idle CPU time)
        }
    }

    var solvedProcessesInfo = [];
    for (var j = 0; j < n; j++) {
        solvedProcessesInfo.push({
            ct: completionTime[j],
            tat: turnaroundTime[j],
            wat: waitingTime[j],
            rt: responseTime[j]
        });
    }
    
    // console.log("QUEUE", JSON.stringify(queue));
    return solvedProcessesInfo;
}

function displayTable(valuesAT, valuesCPU, completionTime, turnaroundTime, waitingTime, responseTime) {
    var tableBody = document.querySelector("#processTable tbody");
    tableBody.innerHTML = ""; // Clear previous rows

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
        cellAT.textContent = valuesAT[i];
        cellBT.textContent = valuesCPU[i];
        cellCT.textContent = completionTime[i];
        cellTAT.textContent = turnaroundTime[i];
        cellWT.textContent = waitingTime[i];
        cellRT.textContent = responseTime[i];
    }
}