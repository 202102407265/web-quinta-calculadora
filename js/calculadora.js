const Operadoras = {
    OperadoraA: 'Operadora de Saúde A',
    OperadoraB: 'Operadora de Saúde B'
}


const listaOperadoraDeSaude = [
    Operadoras.OperadoraA,
    Operadoras.OperadoraB
];

const TipoPlano = {
    BASICO: 'basico',
    STANDARD: 'standard',
    PREMIUM: 'premium'
};

const listaTiposDePlano = [ TipoPlano.BASICO, TipoPlano.STANDARD, TipoPlano.PREMIUM ];

const precoBasePorTipoPlano = {};
precoBasePorTipoPlano[TipoPlano.BASICO] = 100;
precoBasePorTipoPlano[TipoPlano.STANDARD] = 150;
precoBasePorTipoPlano[TipoPlano.PREMIUM] = 200;

const Comorbidade = {
    IMC_BAIXO_PESO: 'Baixo peso',
    ICM_NORMAL: 'Normal',
    IMC_SOBREPESO: 'Sobrepeso',
    IMC_OBESIDADE: 'Obesidade',
    IMC_OBESIDADE_GRAVE: 'Obesidade mórbida grave',
    IMC_OBESIDADE_MUITO_GRAVE: 'Obesidade mórbida muito grave'    
};

const FatorComorbidade = {};
FatorComorbidade[Comorbidade.IMC_BAIXO_PESO] = 10;
FatorComorbidade[Comorbidade.ICM_NORMAL] = 1;
FatorComorbidade[Comorbidade.IMC_SOBREPESO] = 6;
FatorComorbidade[Comorbidade.IMC_OBESIDADE] = 10;
FatorComorbidade[Comorbidade.IMC_OBESIDADE_GRAVE] = 20;
FatorComorbidade[Comorbidade.IMC_OBESIDADE_MUITO_GRAVE] = 30;

function calculaPrecoOferta(operadora, tipoPlano, precoBase, idade, imc, comorbidade) {
    operadora = operadora && listaOperadoraDeSaude.indexOf(operadora) >= 0 ? operadora : false;
    tipoPlano = tipoPlano && listaTiposDePlano.indexOf(tipoPlano) >= 0 ? tipoPlano : false;
    precoBase = precoBase && ehValor(precoBase) && Number(precoBase) > 0 ? precoBase : false;
    idade = idade && ehValor(idade) && Number(idade) > 0 ? idade : false;
    imc = imc && ehValor(imc) && Number(imc) > 0 ? imc : false;

    if (!operadora || !tipoPlano || !precoBase || !idade || !imc) {
        throw new Error('Dados inválidos, revise os valores informados!');
    }
    if (operadora == Operadoras.OperadoraB) {
        comorbidade = comorbidade && FatorComorbidade[comorbidade] ? comorbidade : false;
        if (comorbidade) {
            const fatorComorbidade = FatorComorbidade[comorbidade];
            switch (tipoPlano) {
                case TipoPlano.BASICO:
                    return precoBase + (fatorComorbidade * 10 * (imc / 10));
                    break;
                case TipoPlano.STANDARD:
                    return (precoBase + (fatorComorbidade * 15)) * (imc/10);
                    break;
                case TipoPlano.PREMIUM:
                    return (precoBase - (imc * 10)+(fatorComorbidade  * 20)) * (imc / 10);
                    break;
                default:
                    return 0;
            }
        } else {
            return 0;
        }    
    } else {
        switch (tipoPlano) {
            case TipoPlano.BASICO:
                return precoBase + (idade * 10 * (imc / 10));
                break;
            case TipoPlano.STANDARD:
                return (precoBase + (idade * 15)) * (imc/10);
                break;
            case TipoPlano.PREMIUM:
                return (precoBase - (imc * 10)+(idade * 20)) * (imc / 10);
                break;
            default:
                return 0;
        }
    }
}

function calculaImc(peso, altura) {
    peso = peso && ehValor(peso) && Number(peso) > 0 ? peso : false;
    altura = altura && ehValor(altura) && Number(altura) > 0 ? altura : false;
    if (!peso || !altura) throw new Error('Dados inválidos para cáculo do IMC, informe peso e altura válidos.');
    return peso / (altura * altura);
}

function calculaComorbidade(imc) {
    return imc < 18.5
        ? Comorbidade.IMC_BAIXO_PESO
        : imc >= 18.5 &&  imc <= 24.9
            ? Comorbidade.ICM_NORMAL
            : imc >= 25 && imc <= 29.9
                ? Comorbidade.IMC_SOBREPESO
                : imc >= 30 && imc <= 34.9
                    ? Comorbidade.IMC_OBESIDADE
                    : imc > 35 && imc <= 39.9
                        ? Comorbidade.IMC_OBESIDADE_GRAVE
                        : imc >= 40
                            ? Comorbidade.IMC_OBESIDADE_MUITO_GRAVE
                            : null;

}

function calculaMelhorOferta(idade, peso, altura) {
    const ofertas = [];
    const imc = calculaImc(peso, altura);
    const comorbidade = calculaComorbidade(imc);
    const planos = [TipoPlano.BASICO, TipoPlano.STANDARD, TipoPlano.PREMIUM];
    for (let i = 0; i < listaOperadoraDeSaude.length; i++) {
        const operadora = listaOperadoraDeSaude[i];
        for (let x = 0; x < planos.length; x++) {
            const tipoPlano = planos[x];
            const preco = calculaPrecoOferta(operadora, tipoPlano, precoBasePorTipoPlano[tipoPlano], idade, imc, comorbidade);
            //if (preco > 0) {
                ofertas.push({ operadora, tipoPlano, preco: preco.toFixed(2) });
            //}
        }
    }
    const ofertasOrdenadasPorMenorValor = ofertas.sort(function (a, b) {
        return a.preco - b.preco;
    });

    return {
        imc,
        comorbidade,
        ofertas: ofertasOrdenadasPorMenorValor,
        melhorOferta: ofertasOrdenadasPorMenorValor[0]
    }
}
