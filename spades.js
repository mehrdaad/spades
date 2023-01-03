var lastRow = 0;

function getFileName() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return yyyy + mm + dd + '.txt';
}

function save_click() {
    let data = '';
    for (let i = 1; i < lastRow; i++){
        data += $('#P1Read' + i).val() + '_' + $('#P1Taken' + i).val() + '_' + $('#P2Read' + i).val() + '_' + $('#P2Taken' + i).val() + '_' + $('#P3Read' + i).val() + '_' + $('#P3Taken' + i).val() + '_' + $('#P4Read' + i).val() + '_' + $('#P4Taken' + i).val() + '\n';
    }
    let d = new Blob([data], { type: "application/json;utf-8" });

    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', getFileName());
    downloadLink.setAttribute('href', window.URL.createObjectURL(d));
    downloadLink.click();
}

function calcBag(firstRead, secondRead, firstTaken, secondTaken) {
    let result = 0;

    if (firstRead < 0) {
        result += firstTaken;
        firstRead = 0;
        firstTaken = 0;
    }

    if (secondRead < 0) {
        result += secondTaken;
        secondRead = 0;
        secondTaken = 0;
    }

    if (firstRead + secondRead <= firstTaken + secondTaken) {
        result += firstTaken + secondTaken - firstRead - secondRead;
    }

    return result;
}

function calcPointWithNill(nillPoint, nillTaken) {
    let result = 0;
    if (nillTaken == 0) {
        result = nillPoint;
    }
    else {
        result = nillTaken - nillPoint;
    }

    return result;
}

function calcPoint(firstRead, secondRead, firstTaken, secondTaken) {
    let result = 0;

    if (firstRead == -1 || firstRead == -2) {
        let nillPoint = firstRead * -1 * 100;
        result += calcPointWithNill(nillPoint, firstTaken);
        firstRead = 0;
        firstTaken = 0;
    }

    if (secondRead == -1 || secondRead == -2) {
        let nillPoint = secondRead * -1 * 100;
        result += calcPointWithNill(nillPoint, secondTaken);
        secondRead = 0;
        secondTaken = 0;
    }

    if (firstRead + secondRead <= firstTaken + secondTaken) {
        let majorScore = 10 * (firstRead + secondRead);
        let minorScore = firstTaken + secondTaken - firstRead - secondRead;
        result += majorScore + minorScore;
    }
    else {
        result -= 10 * (firstRead + secondRead);
    }

    return result;
}

function makeRowReadOnly(i) {
    $('#P1Read' + i).attr("disabled", true);
    $('#P2Read' + i).attr("disabled", true);
    $('#P3Read' + i).attr("disabled", true);
    $('#P4Read' + i).attr("disabled", true);
    $('#P1Taken' + i).attr("disabled", true);
    $('#P2Taken' + i).attr("disabled", true);
    $('#P3Taken' + i).attr("disabled", true);
    $('#P4Taken' + i).attr("disabled", true);
}

function calculate() {
    let totalPointL = 0;
    let totalBagL = 0;
    let groupBagL = 0;

    let totalPointR = 0;
    let totalBagR = 0;
    let groupBagR = 0;

    for (let i = 1; i <= lastRow; i++) {
        let p1Taken = parseInt($('#P1Taken' + i).val());
        let p2Taken = parseInt($('#P2Taken' + i).val());
        let p3Taken = parseInt($('#P3Taken' + i).val());
        let p4Taken = parseInt($('#P4Taken' + i).val());

        if (p1Taken + p2Taken + p3Taken + p4Taken != 13) {
            return 'Total taken cards must be 13';
        }


        let p1Read = parseInt($('#P1Read' + i).val());
        let p2Read = parseInt($('#P2Read' + i).val());
        let pointL = calcPoint(p1Read, p2Read, p1Taken, p2Taken);
        totalPointL += pointL;
        $('#PL' + i).text(pointL);

        let bagL = calcBag(p1Read, p2Read, p1Taken, p2Taken);
        totalBagL += bagL;
        groupBagL += bagL;
        if (groupBagL > 9) {
            groupBagL %= 10;
            $('#BL' + i).css('background-color', 'yellow')
        }
        $('#BL' + i).text(groupBagL);

        let p3Read = parseInt($('#P3Read' + i).val());
        let p4Read = parseInt($('#P4Read' + i).val());
        let pointR = calcPoint(p3Read, p4Read, p3Taken, p4Taken);
        totalPointR += pointR;
        $('#PR' + i).text(pointR);

        let bagR = calcBag(p3Read, p4Read, p3Taken, p4Taken);
        totalBagR += bagR;
        groupBagR += bagR;
        if (groupBagR > 9) {
            groupBagR %= 10;
            $('#BR' + i).css('background-color', 'yellow')
        }
        $('#BR' + i).text(groupBagR);

        makeRowReadOnly(i);
    }

    $('.TotalPointL').text(totalPointL - (100 * Math.floor(totalBagL / 10)));
    $('.TotalPointR').text(totalPointR - (100 * Math.floor(totalBagR / 10)));

    return '';
}

function new_click() {
    let calcMessage = calculate();
    if (calcMessage != '') {
        alert(calcMessage);
        return;
    }

    lastRow++;

    let r = '<tr>';
    r += '<td id="BL' + lastRow + '"></td>';
    r += '<td style="background-color: rgb(202, 220, 236);">R <select id="P1Read' + lastRow + '" class="form-select" aria-label="Default select example"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="-1">N</option><option value="-2">BN</option></select></td>';
    r += '<td style="background-color: bisque;">T <select id="P1Taken' + lastRow + '" class="form-select" aria-label="Default select example"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option></select></td>';
    r += '<td style="background-color: rgb(202, 220, 236);">R <select id="P2Read' + lastRow + '" class="form-select" aria-label="Default select example"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="-1">N</option><option value="-2">BN</option></select></td>';
    r += '<td style="background-color: bisque;">T <select id="P2Taken' + lastRow + '" class="form-select" aria-label="Default select example"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option></select></td>';
    r += '<td style="background-color: rgb(186, 224, 184);" id="PL' + lastRow + '"></td>';
    r += '<td style="background-color: lightgray;">' + lastRow + '</td>';
    r += '<td style="background-color: rgb(186, 224, 184);" id="PR' + lastRow + '"></td>';
    r += '<td style="background-color: rgb(202, 220, 236);">R <select id="P3Read' + lastRow + '" class="form-select" aria-label="Default select example"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="-1">N</option><option value="-2">BN</option></select></td>';
    r += '<td style="background-color: bisque;">T <select id="P3Taken' + lastRow + '" class="form-select" aria-label="Default select example"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option></select></td>';
    r += '<td style="background-color: rgb(202, 220, 236);">R <select id="P4Read' + lastRow + '" class="form-select" aria-label="Default select example"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="-1">N</option><option value="-2">BN</option></select></td>';
    r += '<td style="background-color: bisque;">T <select id="P4Taken' + lastRow + '" class="form-select" aria-label="Default select example"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option></select></td>';
    r += '<td id="BR' + lastRow + '"></td>';
    r += '</tr>';
    $('#tblResult tr:last').before(r);
}