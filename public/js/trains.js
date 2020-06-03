$(document).ready(function() {
    fillTable();
    $(`#createTrainButton`).on(`click`, createTrain);
    $(`#trainsList tbody`).on('click', 'tr button.btn-danger', deleteTrain);
    $(`#trainsList tbody`).on('click', 'tr', showTrainInfo);
});

function fillTable() {
    $(`#trainInfoId`).text('');
    $(`#trainInfoName`).text('');
    $(`#trainInfoRoute`).text('');
    $(`#trainInfoSeats`).text('');
    let tableContent = '';
    $.getJSON('/service/trains', function(data) {
        $.each(data, function() {
            tableContent += `<tr id="${this.id}">`;
            tableContent += `<td>${this.id}</td>`;
            tableContent += `<td>${this.name}</td>`;
            tableContent += `<td>${this.route}</td>`;
            tableContent += `<td>${this.seats}</td>`;
            tableContent += `<td><button type="button" class="btn btn-danger">Delete</button></td>`
            tableContent += `</tr>`;
        });
        $(`#trainsList tbody`).html(tableContent);
    });
}

function createTrain(event) {
    event.preventDefault();
    let id = $(`#inputId`).val();
    let name = $(`#inputName`).val();
    let start = $(`#inputRouteStart`).val();
    let finish = $(`#inputRouteFinish`).val();
    let seats = $(`#inputSeats`).val();
    if (!id.trim().length || !name.trim().length || !start.trim().length || !finish.trim().length || !seats.trim().length) {
        alert(`Please, fill in all of the fields`);
        return;
    }
    $.ajax({
        url: `/service/trains`,
        type: `POST`,
        data: {id: id, name: name, route: `${start}:${finish}`, seats: seats},
        success: function(result) {
            alert(result);
            fillTable();
        }
    });
}

function showTrainInfo(event) {
    event.preventDefault();
    let trainId = $(this).attr("id");
    $.getJSON(`/service/trains/${trainId}`, function(data) {
        $(`#trainInfoId`).text(data.id);
        $(`#trainInfoName`).text(data.name);
        $(`#trainInfoRoute`).text(data.route);
        $(`#trainInfoSeats`).text(data.seats);
    });
}

function deleteTrain(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    let data = $(this).parent().parent();
    let id = $(data).find(`td:nth-child(1)`).text();
    let name = $(data).find(`td:nth-child(2)`).text();
    let route = $(data).find(`td:nth-child(3)`).text();
    if (confirm(`Are you sure you want to delete train [${id}] ${name} (${route})?`)) {
        $.ajax({
            url: `/service/trains/${id}`,
            type: `DELETE`,
            success: function(result) {
                alert(result);
                fillTable();
            }
        });
    }
}
