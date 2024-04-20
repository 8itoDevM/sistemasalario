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
    var userLastRow = 0;

    setInterval(function() {
        var searchValue = document.getElementById('text-search').value;

        for(let i = data.table.rows.length - 1; i >= 0; i--){
            if(searchValue == data.table.rows[i].c[3].v && data.table.rows[i].c[4].v) {
                getUserLastRow();
                hourText.innerHTML = "Horas trabalhadas: " + data.table.rows[userLastRow].c[5].v / 1000;

                calculateSalary();
            }
        }

        function getUserLastRow(){
            for(let i = data.table.rows.length - 1; i >= 0; i--){
                if(searchValue == data.table.rows[i].c[3].v && data.table.rows[i].c[4].v == "Fechado"){
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
        function calculateSalary(){
            var monthlyHours = 0;
            var oneMonthAgo = new Date();
            oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

            console.log("Mês passado: "+ oneMonthAgo);

            getUserLastRow();
            for(let i = userLastRow; i >= 1; i--){
                console.log("Indice do for: "+ i);

                var pointDate = new Date();

                strDate = data.table.rows[i].c[2].f;
                pointDate.setDate(strDate.slice(0, 2), strDate.slice(2, 4))
                console.log("Point date: "+ pointDate);

                if(pointDate.getMonth() < oneMonthAgo.getMonth()){
                    break;
                }

                // checar se o nome é igual
                if(data.table.rows[i].c[3].v == searchValue){
                    continue;
                }
                console.log("Nome que sai na checagem: "+ data.table.rows[i].c[3].v);


                var startTime = new Date(data.table.rows[i].c[0].f);

                console.log("Start time: "+ startTime);

                var endTime = new Date(data.table.rows[i].c[1].f);

                console.log("End time: "+ endTime);

                if (isNaN(startTime) || isNaN(endTime)) {
                    continue;
                }
                
                var hoursWorked = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60;
                monthlyHours += hoursWorked;
            }

            sendButton.style.visibility = 'visible';
        }
    }, 500);

    document.getElementById("information").appendChild(hourText);
}); 