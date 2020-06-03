$(document).ready(function() {
    fillTable();
    $(`#createUserButton`).on(`click`, createUser);
    $(`#passengersList tbody`).on('click', 'tr button.btn-danger', deletePassenger);
    $(`#passengersList tbody`).on('click', 'tr', showPassengerInfo);
});

function fillTable() {
    $(`#passengerInfoId`).text('');
    $(`#passengerInfoName`).text('');
    $(`#passengerInfoSurname`).text('');
    let tableContent = '';
    $.getJSON('/service/passengers', function(data) {
        $.each(data, function() {
            tableContent += `<tr id="${this.id}">`;
            tableContent += `<td>${this.id}</td>`;
            tableContent += `<td>${this.name}</td>`;
            tableContent += `<td>${this.surname}</td>`;
            tableContent += `<td><button type="button" class="btn btn-danger">Delete</button></td>`
            tableContent += `</tr>`;
        });
        $(`#passengersList tbody`).html(tableContent);
    });
}

function createUser(event) {
    event.preventDefault();
    let id = $(`#inputId`).val();
    let name = $(`#inputName`).val();
    let surname = $(`#inputSurname`).val();
    if (!id.trim().length || !name.trim().length || !surname.trim().length) {
        alert(`Please, fill in all of the fields`);
        return;
    }
    $.ajax({
        url: `/service/passengers`,
        type: `POST`,
        data: {id: id, name: name, surname: surname},
        success: function(result) {
            alert(result);
            fillTable();
        }
    });
}

function showPassengerInfo(event) {
    event.preventDefault();
    let passengerId = $(this).attr("id");
    $.getJSON(`/service/passengers/${passengerId}`, function(data) {
        $(`#passengerInfoId`).text(data.id);
        $(`#passengerInfoName`).text(data.name);
        $(`#passengerInfoSurname`).text(data.surname);
    });
}

function deletePassenger(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    let data = $(this).parent().parent();
    let id = $(data).find(`td:nth-child(1)`).text();
    let name = $(data).find(`td:nth-child(2)`).text();
    let surname = $(data).find(`td:nth-child(3)`).text();
    if (confirm(`Are you sure you want to delete passenger [${id}] ${name} ${surname}?`)) {
        $.ajax({
            url: `/service/passengers/${id}`,
            type: `DELETE`,
            success: function(result) {
                alert(result);
                fillTable();
            }
        });
    }
}
