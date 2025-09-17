
    document.addEventListener("DOMContentLoaded", () => {
      const attendanceForm = document.getElementById("attendance-form");
      const tableBody = document.querySelector("#attendanceTable tbody");
      const studentSelect = document.getElementById("studentName");
      const dateInput = document.getElementById("attendanceDate");
      const statusSelect = document.getElementById("attendanceStatus");
      const totalRecords = document.getElementById("totalRecords");
      const totalStudents = document.getElementById("totalStudents");
      const presentCount = document.getElementById("presentCount");
      const absentCount = document.getElementById("absentCount");

      // Set default date to today
      const today = new Date();
      dateInput.value = today.toISOString().split("T")[0];

      // Update stats function
      function updateStats() {
        const rows = tableBody.querySelectorAll("tr");
        totalRecords.textContent = `🛈 Total de registros mostrados: ${rows.length}`;
        totalStudents.textContent = rows.length;

        let present = 0,
          absent = 0;
        rows.forEach((row) => {
          const statusSpan = row.querySelector("td:nth-child(4) span");
          if (!statusSpan) return;
          if (statusSpan.textContent === "Presente") present++;
          else if (statusSpan.textContent === "Ausente") absent++;
        });
        presentCount.textContent = present;
        absentCount.textContent = absent;
      }

      // Add new attendance row
      attendanceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = studentSelect.value;
        const date = dateInput.value;
        const status = statusSelect.value;
        if (!name || !date || !status) return;

        const dateObj = new Date(date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(
          dateObj.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${dateObj.getFullYear()}`;

        const rowCount = tableBody.rows.length + 1;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <th scope="row">${rowCount}</th>
          <td data-label="Nombre">${name}</td>
          <td data-label="Fecha">${formattedDate}</td>
          <td data-label="Estado"><span class="status-${status.toLowerCase()}">${status}</span></td>
          <td class="actions" data-label="Acciones">
            <button class="btn btn-sm btn-outline-primary edit-btn"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger delete-btn"><i class="bi bi-trash"></i></button>
          </td>
        `;
        tableBody.appendChild(tr);
        attendanceForm.reset();
        dateInput.value = today.toISOString().split("T")[0];
        updateStats();
      });

      // Delegate click events for edit and delete buttons
      tableBody.addEventListener("click", (e) => {
        const target = e.target.closest("button");
        if (!target) return;

        const row = target.closest("tr");
        if (!row) return;

        if (target.classList.contains("delete-btn")) {
          // Delete row
          row.remove();
          updateRowNumbers();
          updateStats();
        } else if (target.classList.contains("edit-btn")) {
          // Edit row: replace status cell with select dropdown
          const statusCell = row.querySelector("td:nth-child(4)");
          const currentStatusSpan = statusCell.querySelector("span");
          const currentStatus = currentStatusSpan.textContent;

          // If already editing, do nothing
          if (statusCell.querySelector("select")) return;

          const select = document.createElement("select");
          select.className = "form-select form-select-sm";
          ["Presente", "Ausente", "Tardanza"].forEach((st) => {
            const option = document.createElement("option");
            option.value = st;
            option.textContent = st;
            if (st === currentStatus) option.selected = true;
            select.appendChild(option);
          });

          // Replace span with select
          statusCell.innerHTML = "";
          statusCell.appendChild(select);

          // Change edit button to save button
          target.innerHTML = '<i class="bi bi-check-lg"></i>';
          target.classList.remove("btn-outline-primary");
          target.classList.add("btn-outline-success");

          // Disable delete button while editing
          const deleteBtn = row.querySelector(".delete-btn");
          deleteBtn.disabled = true;

          // Save handler
          target.onclick = () => {
            const newStatus = select.value;
            statusCell.innerHTML = `<span class="status-${newStatus.toLowerCase()}">${newStatus}</span>`;

            // Restore edit button
            target.innerHTML = '<i class="bi bi-pencil"></i>';
            target.classList.remove("btn-outline-success");
            target.classList.add("btn-outline-primary");
            target.onclick = null;

            // Enable delete button
            deleteBtn.disabled = false;

            updateStats();
          };
        }
      });

      // Update row numbers after deletion
      function updateRowNumbers() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, i) => {
          row.querySelector("th").textContent = i + 1;
        });
      }

      updateStats();
    });