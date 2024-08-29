const validarEntradaCPF = (cpf) =>{
   if(!isNaN(cpf) && cpf.length == 11){
      let digito_verificador1 = (cpf[0] * 10) + (cpf[1] * 9) + (cpf[2] * 8) + (cpf[3] * 7) + (cpf[4] * 6) + (cpf[5] * 5) + (cpf[6] * 4) + (cpf[7] * 3) + (cpf[8] * 2)
      digito_verificador1 = 11 - (digito_verificador1 % 11)
      digito_verificador1 = digito_verificador1 > 9 ? 0 : digito_verificador1
      
      if(digito_verificador1 != cpf[9]){
         return false
      }

      let digito_verificador2 = (cpf[0] * 11) + (cpf[1] * 10) + (cpf[2] * 9) + (cpf[3] * 8) + (cpf[4] * 7) + (cpf[5] * 6) + (cpf[6] * 5) + (cpf[7] * 4) + (cpf[8] * 3) + (cpf[9] * 2)
      digito_verificador2 = 11 - (digito_verificador2 % 11)
      digito_verificador2 = digito_verificador2 > 9 ? 0 : digito_verificador2
      
      if(digito_verificador2 != cpf[10]){
         return false
      }
      
      return true
   }
   return false
}

const validarEntradaValor = (valor) => {
   if(valor == null || valor > 15000 || valor < -2000 ){
      return false
   }
   return true
}

const validarEntradaDeDados = (lancamento) => {
   let cpf_valido = validarEntradaCPF(lancamento.cpf);
   let valor_valido = validarEntradaValor(lancamento.valor);

   if(valor_valido && cpf_valido){
      return null
   } else if(!valor_valido && cpf_valido){
      return 'O valor inserido é inválido'
   } else if(valor_valido && !cpf_valido){
      return 'O CPF é inválido'
   } else{
      return 'O valor e CPF são inválidos'
   }
}

const lancamentosPorCPF = (lancamentos) =>{
   let dicionario_contas = new Map()

   for (i = 0; i < lancamentos.length; i++){
      if(dicionario_contas.has(lancamentos[i].cpf)){
         dicionario_contas.get(lancamentos[i].cpf).push(lancamentos[i].valor)
      }else{
         dicionario_contas.set(lancamentos[i].cpf, [lancamentos[i].valor])
      }
   }

   return Array.from(dicionario_contas, ([cpf, valor]) => ({ cpf, valor }));
}

const recuperarSaldosPorConta = (lancamentos) => {
   if(!lancamentos){
      return []
   }
   let array_contas = lancamentosPorCPF(lancamentos)
   array_contas.map((elemento) => {
      elemento.valor = elemento.valor.reduce((accumulator, currentValue) => {
         return accumulator + currentValue
      },0);
   })
   return array_contas;
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   let lancamento_por_cpf = []
   for (i = 0; i < lancamentos.length; i++){
      if(lancamentos[i].cpf == cpf){
         lancamento_por_cpf.push(lancamentos[i].valor)
      }
   }
   let maior_lancamento = Math.max.apply(Math,lancamento_por_cpf)
   let menor_lancamento = Math.min.apply(Math,lancamento_por_cpf)

   return [{cpf:cpf, valor: menor_lancamento},{cpf:cpf, valor: maior_lancamento}]
}

const atualizarMaximoSaldo = (lancamentos_maximos, lancamento, index_lancamento) => {
   for(j = 0; j < index_lancamento + 1; j++){
      lancamentos_maximos[j] = j == index_lancamento ? lancamento : lancamentos_maximos[j+1]
   }
}

const selecionar3Maiores = (saldos_por_cpf) =>{
   if(saldos_por_cpf.length >= 3){
      let saldos_maximos = [null, null, null]
      for (i = 0; i < saldos_por_cpf.length; i++){
         if (saldos_maximos[2] == null || saldos_por_cpf[i].valor > saldos_maximos[2].valor){
            atualizarMaximoSaldo(saldos_maximos, saldos_por_cpf[i], 2)
         }else if (saldos_maximos[1] == null || saldos_por_cpf[i].valor > saldos_maximos[1].valor) {
            atualizarMaximoSaldo(saldos_maximos, saldos_por_cpf[i], 1)
         }else if (saldos_maximos[0] == null || saldos_por_cpf[i].valor > saldos_maximos[0].valor) {
            atualizarMaximoSaldo(saldos_maximos, saldos_por_cpf[i], 0)
         }
      }
      return saldos_maximos.reverse()
   }
   return saldos_por_cpf.sort()
}

const recuperarMaioresSaldos = (lancamentos) => {
   let saldos_por_cpf = recuperarSaldosPorConta(lancamentos)
   return selecionar3Maiores(saldos_por_cpf)
}

const calcularMedia = (array_valores) =>{
   const soma = array_valores.reduce((acumulador, elemento) => acumulador + elemento, 0);
   const media = soma / array_valores.length;
   return media
}

const recuperarMediaSaldosPorConta = (lancamentos) => {
   if(!lancamentos){
      return []
   }
   let array_contas = lancamentosPorCPF(lancamentos)
   array_contas.map((elemento) => {
      elemento.valor = calcularMedia(elemento.valor)
   })
   return array_contas;
}

const recuperarMaioresMedias = (lancamentos) => {
   let medias_por_cpf = recuperarMediaSaldosPorConta(lancamentos)
   return selecionar3Maiores(medias_por_cpf)
}