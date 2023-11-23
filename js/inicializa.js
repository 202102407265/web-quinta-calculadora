function inicializa() {
    // entrada de dados
    const nome = document.getElementById("nome");
    const idade = document.getElementById("idade");
    const peso = document.getElementById("peso");
    const altura = document.getElementById("altura");
    
    // mockando valores
    nome.value = "Hugo de Castro Araujo";
    idade.value = "42";
    peso.value = "90";
    altura.value = "1.80";
    
    // saida de dados
    const operadora = document.getElementById("operadora");
    const plano = document.getElementById("plano");
    const preco = document.getElementById("preco");
    const extrato = document.getElementById("extrato");
    const imc = document.getElementById("imc");
    const comorbidade = document.getElementById("comorbidade");

    const botaoCalcularOfertas = document.getElementById("botaoCalcularOferta");
    botaoCalcularOfertas.addEventListener("click", function () {
        // processamento
        if (nome && idade && altura && peso && imc && comorbidade) {
            try {
                const calculo = calculaMelhorOferta(idade.value, peso.value, altura.value);
                if (operadora && plano && preco && extrato) {
                    if (calculo.melhorOferta) {
                        imc.value = calculo.imc.toFixed(2).replace(".", ",");
                        comorbidade.value = calculo.comorbidade;
                        operadora.value = calculo.melhorOferta.operadora;
                        plano.value = calculo.melhorOferta.tipoPlano;
                        preco.value = calculo.melhorOferta.preco.replace(".", ",");
                    }
                    extrato.innerHTML = "";
                    for (let i = 0; i < calculo.ofertas.length; i++) {
                        const item = document.createElement('tr');

                        // adicionando operadora
                        const operadoraOferta = document.createElement('td');
                        operadoraOferta.innerHTML = calculo.ofertas[i].operadora;
                        item.appendChild(operadoraOferta);

                        // adicionando operadora
                        const planoOferta = document.createElement('td');
                        planoOferta.innerHTML = calculo.ofertas[i].tipoPlano;
                        item.appendChild(planoOferta);

                        // adicionando operadora
                        const precoOferta = document.createElement('td');
                        precoOferta.innerHTML = `R$ ${calculo.ofertas[i].preco.replace(".", ",")}`;
                        item.appendChild(precoOferta);

                        extrato.appendChild(item);
                    }
                }
            } catch(e) {
                alert(e.message);
            }
        }
    });
}



document.addEventListener("DOMContentLoaded", inicializa, false);
