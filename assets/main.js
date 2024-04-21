let sheet_id = '1dtA-67RKJ3RJWM5GClAHL3-CkU8qgypmEati0AQNdhg';
let sheet_title = 'Pontos';
let sheet_range = 'A1:F1000';

let full_url = 'https://docs.google.com/spreadsheets/d/' + sheet_id + '/gviz/tq?sheet=' + sheet_title + '&range=' + sheet_range;



fetch(full_url)
.then(res => res.text())
.then(rep => {
    let data = JSON.parse(rep.substr(47).slice(0,-2));

    //console.log(data.table.rows[0].c[0].f); - Pega o Horário de entrada na tabela
    // console.log(data.table.rows[0].c[1].f); - Pega o Horárior de saída na tabela
    // console.log(data.table.rows[0].c[2].f); - Pega a data na tabela
    // console.log(data.table.rows[0].c[3].v); - Pega o nome na tabela
    // console.log(data.table.rows[0].c[4].v); - Pega o status na tabela
    // console.log(data.table.rows[0].c[5].v); - Pega as horas semanais totais na tabela

    sendButton = document.getElementById("send-btn");
    sendButton.style.visibility = 'hidden'

    let hourText = document.createElement("p");
    let salaryText = document.createElement("p");
    var userLastRow = 0;

    setInterval(function() {
        var searchValue = document.getElementById('text-search').value;

        var monthlyHours = 0;
        var oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        var salary = 0.0;
        var baseSalary = 1100.0;
        var hoursExpected = 80;

        for(let i = data.table.rows.length - 1; i >= 0; i--){
            if(searchValue == data.table.rows[i].c[3].v && data.table.rows[i].c[4].v == "Fechado") {
                getUserLastRow();

                console.log("Nome da pessoa do userlastrow: " + data.table.rows[i].c[3].v);
                console.log("Data deste ponto do user last row: " + data.table.rows[i].c[2].f);
                
                console.log(" ");

                var pointDate = new Date();

                strDate = data.table.rows[i].c[2].f;
                pointDate.setDate(strDate.slice(0, 2), strDate.slice(2, 4))
                console.log("Point date: "+ pointDate);

                if (pointDate < oneMonthAgo) {
                    console.log("pointdate é menor que onemonthago")
                    break; // Se a data do ponto é mais de uma semana atrás, paramos de iterar
                }
                
                // Verifique se o nome do usuário é o mesmo
                if (data.table.rows[i].c[3].v != searchValue) {
                    console.log("o nome não é igual");
                    continue; // Se o nome do usuário não é o mesmo, ignoramos este ponto
                }
                
                console.log(" ");

                console.log("Tempo que irá ser inserido em start time: " + data.table.rows[i].c[0].f);
                console.log("Tempo que irá ser inserido em end time: " + data.table.rows[i].c[1].f);

                var startTime = new Date();
                var strStartTime = data.table.rows[i].c[0].f;

                // Verifique se a string contém uma barra (":")
                if (strStartTime.includes(":")) {
                    // Se sim, divida a string em horas e minutos
                    var timeStartParts = strStartTime.split(":");
                    startTime.setHours(timeStartParts[0]);
                    startTime.setMinutes(timeStartParts[1]);
                } else {
                    // Se não, continue usando o método slice
                    startTime.setHours(strStartTime.slice(0, 2));
                    startTime.setMinutes(strStartTime.slice(2, 4));
                }

                var endTime = new Date();
                var strEndTime = data.table.rows[i].c[1].f;

                // Verifique se a string contém uma barra (":")
                if (strEndTime.includes(":")) {
                    // Se sim, divida a string em horas e minutos
                    var timeEndParts = strEndTime.split(":");
                    endTime.setHours(timeEndParts[0]);
                    endTime.setMinutes(timeEndParts[1]);
                } else {
                    // Se não, continue usando o método slice
                    endTime.setHours(strEndTime.slice(0, 2));
                    endTime.setMinutes(strEndTime.slice(2, 4));
                }

                console.log(" ");

                console.log("Start time do user last row: " + startTime);
                console.log("End time do user last row: " + endTime);

                console.log(" ");

                if (isNaN(startTime) || isNaN(endTime)) {
                    continue; // Se não pudermos converter a hora de início ou fim para uma data, ignoramos este ponto
                }
                
                var hoursWorked = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60; // Convert milissegundos para horas
                monthlyHours += hoursWorked;

                console.log("Horas trabalhadas no mês: " + monthlyHours + "Horas trabalhadas para ser adicionadas nisto: " + hoursWorked);

                calculateSalary();

                hourText.innerHTML = "Horas trabalhadas neste mês: " + monthlyHours.toFixed(2);
                salaryText.innerHTML = "Salário este mês: R$" + salary.toFixed(2);

                console.log(" ");
                console.log(" ");
                console.log(" ");

                sendButton.style.visibility = 'visible';
            }
        }

        function calculateSalary(){
            if(monthlyHours > hoursExpected){
                salary = (hoursExpected / hoursExpected) * baseSalary;
            } else{
                salary = (monthlyHours / hoursExpected) * baseSalary;
            }
            return salary;
        }

        function getUserLastRow(){
            for(let i = data.table.rows.length - 1; i >= 0; i--){
                if(searchValue == data.table.rows[i].c[3].v){
                    userLastRow = i;
                   //return userLastRow;
                //    console.log(data.table.rows[i].c[2].f);
                //    console.log(data.table.rows[i].c[4].v);
                //    console.log(data.table.rows[i].c[3].v);
                //    console.log(" ");
                //    console.log(" ");
                   break;
                }
            } 
        }
    }, 500);

    document.getElementById("information").appendChild(hourText);
    document.getElementById("information").appendChild(salaryText);
}); 

