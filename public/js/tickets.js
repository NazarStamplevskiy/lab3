$(document).ready(function() {
    fillTable();
    fillPassengersSelect();
    fillTrainsSelect();
    $(`#createTicketButton`).on(`click`, createTicket);
    $(`#ticketsList tbody`).on('click', 'tr button.btn-danger', deleteTicket);
    $(`#ticketsList tbody`).on('click', 'tr', showTicketInfo);
});

function fillPassengersSelect() {
    let passengersSelectContent = '';
    $.getJSON('/service/passengers', function(data) {
        $.each(data, function() {
            passengersSelectContent += `<option value=${this.id}>${this.name} ${this.surname}</option>`;
        });
        $(`#inputPassengerId`).html(passengersSelectContent);
    });
}

function fillTrainsSelect() {
    let trainsSelectContent = '';
    $.getJSON('/service/trains', function(data) {
        $.each(data, function() {
            trainsSelectContent += `<option value=${this.id}>${this.name} [${this.route}] (${this.seats})</option>`;
        });
        $(`#inputTrainId`).html(trainsSelectContent);
    });
}

function fillTable() {
    $(`#ticketInfoId`).text('');
    $(`#ticketInfoPrice`).text('');
    $(`#ticketInfoPassenger`).text('');
    $(`#ticketInfoTrain`).text('');
    $(`#ticketInfoSeat`).text('');
    $(`#ticketInfoDate`).text('');
    let tableContent = '';
    $.getJSON('/service/tickets', function(data) {
        $.each(data, function() {
            tableContent += `<tr id="${this.id}">`;
            tableContent += `<td>${this.id}</td>`;
            tableContent += `<td>${this.price}</td>`;
            tableContent += `<td>${this.passenger.name} ${this.passenger.surname}</td>`;
            tableContent += `<td>${this.train.name} ${this.train.route} - ${this.train.seats}</td>`;
            tableContent += `<td>${this.seat}</td>`;
            tableContent += `<td>${this.date}</td>`;
            tableContent += `<td><button type="button" class="btn btn-danger">Delete</button></td>`
            tableContent += `</tr>`;
        });
        $(`#ticketsList tbody`).html(tableContent);
    });
}

function createTicket(event) {
    event.preventDefault();
    let id = $(`#inputId`).val();
    let price = $(`#inputPrice`).val();
    let passengerId = $(`#inputPassengerId`).children(`option:selected`).val();
    let trainId = $(`#inputTrainId`).children(`option:selected`).val();
    let seat = $(`#inputSeat`).val();
    let date = $(`#inputDate`).val();
    if (!id.trim().length || !price.trim().length || !passengerId.trim().length || !trainId.trim().length || !seat.trim().length || !date.trim().length) {
        alert(`Please, fill in all of the fields`);
        return;
    }
    let passenger = undefined;
    $.ajax({
        url: `/service/passengers/${passengerId}`,
        type: `GET`,
        async: false,
        success: function(data) {
            passenger = {
                id: data.id,
                name: data.name,
                surname: data.surname
            }
        }
    });
    let train = undefined;
    $.ajax({
        url: `/service/trains/${trainId}`,
        type: `GET`,
        async: false,
        success: function(data) {
            train = {
                id: data.id,
                name: data.name,
                route: data.route,
                seats: data.seats
            }
        }
    });
    let ticket = {
        id: id,
        price: price,
        passenger: passenger,
        train: train,
        seat: seat,
        date: date
    }
    $.ajax({
        url: `/service/tickets`,
        type: `POST`,
        data: ticket,
        success: function(result) {
            alert(result);
            fillTable();
        }
    });
}

function showTicketInfo(event) {
    event.preventDefault();
    let ticketId = $(this).attr("id");
    $.getJSON(`/service/tickets/${ticketId}`, function(data) {
        $(`#ticketInfoId`).text(data.id);
        $(`#ticketInfoPrice`).text(data.price);
        $(`#ticketInfoPassenger`).text(`[${data.passenger.id}] ${data.passenger.name} ${data.passenger.surname}`);
        $(`#ticketInfoTrain`).text(`[${data.train.id}] ${data.train.name} ${data.train.route} - ${data.train.seats}`);
        $(`#ticketInfoSeat`).text(data.seat);
        $(`#ticketInfoDate`).text(data.date);
    });
}

function deleteTicket(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    let data = $(this).parent().parent();
    let id = $(data).find(`td:nth-child(1)`).text();
    if (confirm(`Are you sure you want to delete ticket [${id}]?`)) {
        $.ajax({
            url: `/service/tickets/${id}`,
            type: `DELETE`,
            success: function(result) {
                alert(result);
                fillTable();
            }
        });
    }
}
