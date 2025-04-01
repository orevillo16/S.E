document.addEventListener("DOMContentLoaded", function () {
    const selectOptionDiv = document.querySelector('.select-option');

    // Create a container for the input field
    const dynamicInputDiv = document.createElement('div');
    dynamicInputDiv.id = 'dynamic-input-container';
    dynamicInputDiv.className = 'inner-box-form'; // Use existing styling

    document.querySelectorAll('.select-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            let inputBox = document.getElementById('dynamic-input');

            // If input already exists, remove it
            if (inputBox) {
                inputBox.remove();
            }

            // Create the input field
            inputBox = document.createElement('input');
            inputBox.type = 'text';
            inputBox.id = 'dynamic-input';
            inputBox.autocomplete = "off"; // Matches your existing inputs
            inputBox.required = true;

            // Set placeholder based on the selected radio
            if (this.id === "student") {
                inputBox.placeholder = "Enter student number";
            } 
            if (this.id === "instructor") {
                inputBox.placeholder = "Enter the code";
            }

            // Clear previous content and append input inside the div
            dynamicInputDiv.innerHTML = ""; 
            dynamicInputDiv.appendChild(inputBox);

            // Insert the dynamic div below the radio buttons (if not already added)
            if (!document.getElementById('dynamic-input-container')) {
                selectOptionDiv.insertAdjacentElement('afterend', dynamicInputDiv);
            }
        });
    });
});
