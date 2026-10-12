// Student Registration & Result System - MCA Assignment Logic
document.addEventListener('DOMContentLoaded', () => {
    loadTableData(); // Display data from LocalStorage on page load
});

const studentForm = document.getElementById('studentForm');

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. INPUT: Capture values from the UI
    const studentName = document.getElementById('name').value;
    const rollNo = document.getElementById('roll').value;
    const m1 = parseFloat(document.getElementById('marks1').value);
    const m2 = parseFloat(document.getElementById('marks2').value);
    const m3 = parseFloat(document.getElementById('marks3').value);

    // 2. PROCESSING: Logic & Calculations
    const total = m1 + m2 + m3;
    const percentage = ((total / 300) * 100).toFixed(2);
    const resultStatus = percentage >= 40 ? "Pass" : "Fail";

    // Create the Object
    const studentObj = {
        id: Date.now(), // Unique ID for each record
        name: studentName,
        roll: rollNo,
        total: total,
        per: percentage,
        status: resultStatus
    };

    // 3. OUTPUT: Show immediate result on the right-side card
    showLiveResult(studentObj);

    // 4. STORAGE: Save to LocalStorage (Converting Object to JSON)
    saveStudentToStorage(studentObj);

    // Reset form and refresh table
    studentForm.reset();
    loadTableData();
});

// Function to display the output immediately
function showLiveResult(obj) {
    const outputDiv = document.getElementById('liveOutput');
    const colorClass = obj.status === "Pass" ? "pass-badge" : "fail-badge";

    outputDiv.innerHTML = `
        <div class="result-item"><strong>Student:</strong> <span>${obj.name}</span></div>
        <div class="result-item"><strong>Total Marks:</strong> <span>${obj.total} / 300</span></div>
        <div class="result-item"><strong>Percentage:</strong> <span>${obj.per}%</span></div>
        <div class="result-item"><strong>Final Status:</strong> <span class="${colorClass}">${obj.status}</span></div>
    `;
}

// Storage Logic using JSON
function saveStudentToStorage(newStudent) {
    let students = JSON.parse(localStorage.getItem('mca_students')) || [];
    students.push(newStudent);
    localStorage.setItem('mca_students', JSON.stringify(students));
}

// Display Data in Table
function loadTableData() {
    const tableBody = document.getElementById('tableBody');
    const students = JSON.parse(localStorage.getItem('mca_students')) || [];
    
    tableBody.innerHTML = "";

    students.forEach(student => {
        const row = `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.total}</td>
                <td>${student.per}%</td>
                <td class="${student.status.toLowerCase() === 'pass' ? 'pass-badge' : 'fail-badge'}">${student.status}</td>
                <td><button onclick="deleteRow(${student.id})" style="color:red; background:none; border:none; cursor:pointer;">Remove</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Delete Record Logic
function deleteRow(id) {
    let students = JSON.parse(localStorage.getItem('mca_students'));
    students = students.filter(s => s.id !== id);
    localStorage.setItem('mca_students', JSON.stringify(students));
    loadTableData();
}

// Clear Entire Database
document.getElementById('clearAll').addEventListener('click', () => {
    if(confirm("Delete all records from LocalStorage?")) {
        localStorage.removeItem('mca_students');
        document.getElementById('liveOutput').innerHTML = '<p class="placeholder-text">Database Cleared.</p>';
        loadTableData();
    }
});