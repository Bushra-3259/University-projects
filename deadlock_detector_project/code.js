// Function to generate the Allocation, Max, and Available tables when user enters processes and resources
function generateTables() {
    // Get number of processes and resources entered by the user
    const p = parseInt(document.getElementById('processes').value);
    const r = parseInt(document.getElementById('resources').value);

    // If the input is invalid, exit the function
    if (isNaN(p) || isNaN(r) || p < 1 || r < 1) return;

    // Get the container where the tables will be inserted
    let container = document.getElementById('tablesContainer');
    container.innerHTML = ''; // Clear any previous content

    // Create the Allocation table, Max table, and Available table and append them to the container
    container.appendChild(createTable('Allocation', 'alloc', p, r));
    container.appendChild(createTable('Max', 'max', p, r));
    container.appendChild(createTable('Available', 'avail', 1, r));

    // Make the form visible after the tables are generated
    document.getElementById('matrixForm').style.display = 'block';
}

// Function to create a table with specified title, prefix, rows, and columns
function createTable(title, prefix, rows, cols) {
    let wrapper = document.createElement('div');  // Create a div to wrap the table
    let html = `<h3>${title} Matrix</h3><table><tr>`; // Start the HTML for the table header

    // Create column headers
    for (let j = 0; j < cols; j++) html += `<th>R${j}</th>`;
    html += `</tr>`;

    // Create rows of the table
    for (let i = 0; i < rows; i++) {
        html += `<tr>`; // Start a new row
        // Create a cell for each column in the current row
        for (let j = 0; j < cols; j++) {
            html += `<td><input type="number" id="${prefix}_${i}_${j}" required></td>`;
        }
        html += `</tr>`; // End the row
    }
    html += `</table>`; // End the table
    wrapper.innerHTML = html; // Set the HTML of the wrapper div
    return wrapper; // Return the div containing the table
}

// Function to get the matrix (Allocation or Max) from the form inputs
function getMatrix(prefix, rows, cols) {
    let matrix = [];  // Initialize an empty matrix
    for (let i = 0; i < rows; i++) {
        let row = [];  // Initialize an empty row for each row in the matrix
        // Loop through each column and get the value entered by the user
        for (let j = 0; j < cols; j++) {
            row.push(parseInt(document.getElementById(`${prefix}_${i}_${j}`).value) || 0);
        }
        matrix.push(row); // Add the row to the matrix
    }
    return matrix; // Return the full matrix
}

// Function to get the Available vector from the form inputs
function getVector(prefix, cols) {
    let vector = []; // Initialize an empty vector
    // Loop through each column and get the value entered by the user
    for (let j = 0; j < cols; j++) {
        vector.push(parseInt(document.getElementById(`${prefix}_0_${j}`).value) || 0);
    }
    return vector; // Return the vector
}

// Function to check if the system is in a safe state
function isSafeState(alloc, max, avail) {
    const p = alloc.length, r = avail.length;  // Number of processes and resources
    let need = Array.from({length: p}, (_, i) => max[i].map((m, j) => m - alloc[i][j]));  // Calculate the Need matrix
    let finish = Array(p).fill(false);  // Initialize a finish array to track if a process is finished
    let work = [...avail];  // Work array that tracks available resources
    let safeSeq = [];  // Array to store the safe sequence of processes

    // Count the number of processes in a safe state
    let count = 0;
    while (count < p) {
        let found = false;  // Flag to check if we can find a process to complete
        // Loop through each process
        for (let i = 0; i < p; i++) {
            if (!finish[i]) {  // If the process is not finished
                // Check if the process can be allocated resources
                let canAllocate = need[i].every((n, j) => n <= work[j]);
                if (canAllocate) {  // If the process can be allocated resources
                    // Add the allocated resources back to the work array
                    for (let j = 0; j < r; j++) work[j] += alloc[i][j];
                    safeSeq.push(i);  // Add the process to the safe sequence
                    finish[i] = true;  // Mark the process as finished
                    found = true;  // Set found flag to true
                    count++;  // Increment the count
                }
            }
        }
        if (!found) break;  // If no process can be allocated, break the loop
    }

    // Check if all processes are finished
    if (finish.every(f => f)) {
        return { safe: true, sequence: safeSeq };  // Return safe state with the safe sequence
    } else {
        // If deadlock is detected, play sound and show modal
        document.getElementById('deadlockSound').play();
        document.getElementById('modal').style.display = 'block';
        return { safe: false, reason: '💀 Deadlock detected! No safe sequence possible.' };
    }
}

// Function to close the modal when user clicks "Okay"
function closeModal() {
    document.getElementById('modal').style.display = 'none';  // Hide the modal
}

// Event listener for the form submission (when user clicks "Check Safety")
document.getElementById('matrixForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent the default form submission
    const p = parseInt(document.getElementById('processes').value);  // Get number of processes
    const r = parseInt(document.getElementById('resources').value);  // Get number of resources

    // Get the matrices and vector from the form
    let alloc = getMatrix('alloc', p, r);
    let max = getMatrix('max', p, r);
    let avail = getVector('avail', r);

    // Check if the system is in a safe state
    let result = isSafeState(alloc, max, avail);
    let resultDiv = document.getElementById('result');  // Get the result div
    resultDiv.className = 'result ' + (result.safe ? 'safe' : 'unsafe');  // Set the result class based on safety
    resultDiv.innerHTML = result.safe
        ? `✅ Safe State. 🎉 Safe Sequence: ${result.sequence.map(p => 'P' + p).join(' → ')}`
        : `❌ ${result.reason}`;  // Display the result
});
