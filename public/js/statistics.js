$(document).ready(function() {
    fillTrainsSelect();
    fillMostPopularRoutes();
    fillMostProfitableRoutes();
    $(`#findSoldTicketForTrainButton`).on(`click`, fillSoldTicketForTrain);
    fillTrainsWithoutSoldTickets();
});

function fillTrainsSelect() {
    let trainsSelectContent = '';
    $.getJSON('/service/trains', function(data) {
        $.each(data, function() {
            trainsSelectContent += `<option value=${this.id}>${this.name} [${this.route}] (${this.seats})</option>`;
        });
        $(`#inputTrainId`).html(trainsSelectContent);
    });
}

function fillMostPopularRoutes() {
    let tableContent = '';
    $.getJSON('/service/statistics/popularRoutes', function(data) {
        $.each(data, function() {
            tableContent += `<tr>`;
            tableContent += `<td>${this.route}</td>`;
            tableContent += `<td>${this.amount}</td>`;
            tableContent += `</tr>`;
        });
        $(`#mostPopularRoutesTable tbody`).html(tableContent);
    });
}

function fillMostProfitableRoutes() {
    let tableContent = '';
    $.getJSON('/service/statistics/profitRoutes', function(data) {
        $.each(data, function() {
            tableContent += `<tr>`;
            tableContent += `<td>${this.route}</td>`;
            tableContent += `<td>${this.profit}</td>`;
            tableContent += `</tr>`;
        });
        $(`#mostProfitableRoutesTable tbody`).html(tableContent);
    });
}

function fillSoldTicketForTrain(event) {
    event.preventDefault();
    let trainId = $(`#inputTrainId`).children(`option:selected`).val();
    if (!trainId.trim().length) {
        alert(`Please, choose train`);
        return;
    }
    let tableContent = '';
    $.getJSON(`/service/statistics/soldTicketsOnTrain/${trainId}`, function(data) {
        $.each(data, function() {
            tableContent += `<tr>`;
            tableContent += `<td>${this.id}</td>`;
            tableContent += `<td>${this.price}</td>`;
            tableContent += `<td>${this.passenger.name} ${this.passenger.surname}</td>`;
            tableContent += `<td>[${this.train.id}] ${this.train.name} - ${this.train.route} (${this.train.seats})</td>`;
            tableContent += `<td>${this.seat}</td>`;
            tableContent += `<td>${this.date}</td>`;
            tableContent += `</tr>`;
        });
        $(`#soldTicketsForTrainTable tbody`).html(tableContent);
    });
}

function fillTrainsWithoutSoldTickets() {
    let tableContent = '';
    $.getJSON('/service/statistics/trainAndRoutesWithoutSoldTickets', function(data) {
        $.each(data, function() {
            tableContent += `<tr>`;
            tableContent += `<td>${this.id}</td>`;
            tableContent += `<td>${this.name}</td>`;
            tableContent += `<td>${this.route}</td>`;
            tableContent += `<td>${this.seats}</td>`;
            tableContent += `</tr>`;
        });
        $(`#trainsWithoutSoldTicketsTable tbody`).html(tableContent);
    });
}
