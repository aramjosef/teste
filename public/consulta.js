// Função para consultar cliente
function consultarCliente(event) {
    event.preventDefault();
    const documento = document.getElementById('documento').value;
    if (documento) {
        fetch(`/consultarCliente?documento=${documento}`)
            .then(response => response.json())
            .then(cliente => {
                const tbody = document.querySelector('#resultadoConsultaCliente tbody');
                tbody.innerHTML = '';
                if (cliente.error) {
                    alert(cliente.error);
                } else {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cliente.nome}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.telefone}</td>
                        <td>${cliente.endereco}</td>
                        <td>${cliente.pais}</td>
                        <td>${cliente.estado}</td>
                    `;
                    tbody.appendChild(tr);
                }
            })
            .catch(error => {
                console.error('Erro ao consultar cliente:', error);
                alert('Erro ao consultar cliente!');
            });
    } else {
        alert('Por favor, insira um documento válido.');
    }
}

// Função para consultar quarto
function consultarQuarto(event) {
    event.preventDefault();
    const numero = document.getElementById('numero').value;
    if (numero) {
        fetch(`/consulta_quarto?numero=${numero}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#resultadoConsultaQuarto tbody');
                tbody.innerHTML = '';
                if (data.error) {
                    alert(data.error);
                } else {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${data.numero}</td>
                        <td>${data.status}</td>
                        <td>${data.tipo_quarto_id}</td>
                    `;
                    tbody.appendChild(tr);
                }
            })
            .catch(error => {
                console.error('Erro ao consultar quarto:', error);
                alert('Erro ao consultar quarto!');
            });
    } else {
        alert('Por favor, insira um número de quarto válido.');
    }
}

// Função para consultar status do quarto
function consultarStatusQuarto(event) {
    event.preventDefault();
    const status = document.getElementById('status').value;
    fetch(`/consulta_status_quarto?status=${status}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#resultadoConsultaStatusQuarto tbody');
            tbody.innerHTML = '';
            if (data.error) {
                alert(data.error);
            } else {
                data.forEach(quarto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${quarto.numero}</td>
                        <td>${quarto.status}</td>
                        <td>${quarto.tipo_quarto_id}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao consultar status dos quartos:', error);
            alert('Erro ao consultar status!');
        });
}

// Função para consultar data de entrada
function consultarDataEntrada(event) {
    event.preventDefault();
    const dataEntrada = document.getElementById('data_entrada').value;
    if (dataEntrada) {
        fetch(`/consulta_data_entrada?data_entrada=${dataEntrada}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#resultadoConsultaDataEntrada tbody');
                tbody.innerHTML = '';
                if (data.error) {
                    alert(data.error);
                } else {
                    data.forEach(checkin => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${checkin.id_cliente}</td>
                            <td>${checkin.numero_quarto}</td>
                            <td>${checkin.data_en}</td>
                            <td>${checkin.data_sai}</td>
                            <td>${checkin.status}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao consultar data de entrada:', error);
                alert('Erro ao consultar data de entrada!');
            });
    } else {
        alert('Por favor, selecione uma data de entrada válida.');
    }
}

// Função para consultar data de saída
function consultarDataSaida(event) {
    event.preventDefault();
    const dataSaida = document.getElementById('data_saida').value;
    if (dataSaida) {
        fetch(`/consulta_data_saida?data_saida=${dataSaida}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#resultadoConsultaDataSaida tbody');
                tbody.innerHTML = '';
                if (data.error) {
                    alert(data.error);
                } else {
                    data.forEach(checkout => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${checkout.id_cliente2}</td>
                            <td>${checkout.numero_quarto}</td>
                            <td>${checkout.data_entrada}</td>
                            <td>${checkout.data_saida}</td>
                            <td>${checkout.total_pagamento}</td>
                            <td>${checkout.status}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao consultar data de saída:', error);
                alert('Erro ao consultar data de saída!');
            });
    } else {
        alert('Por favor, selecione uma data de saída válida.');
    }
}
