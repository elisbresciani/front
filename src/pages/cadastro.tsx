import {Flex, Button, Stack, Heading, Link } from '@chakra-ui/react'
import { Input } from '../components/Form/Input'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Host from '../controllers/url'
import Router from 'next/router';
import cookie from 'js-cookie'

function validarPIS(pis) {
  var multiplicadorBase = "3298765432";
  var total = 0;
  var resto = 0;
  var multiplicando = 0;
  var multiplicador = 0;
  var digito = 99;
  
  // Retira a mascara
  var numeroPIS = pis.replace(/[^\d]+/g, '');

  if (numeroPIS.length !== 11 || 
      numeroPIS === "00000000000" || 
      numeroPIS === "11111111111" || 
      numeroPIS === "22222222222" || 
      numeroPIS === "33333333333" || 
      numeroPIS === "44444444444" || 
      numeroPIS === "55555555555" || 
      numeroPIS === "66666666666" || 
      numeroPIS === "77777777777" || 
      numeroPIS === "88888888888" || 
      numeroPIS === "99999999999") {
      return false;
  } else {
      for (var i = 0; i < 10; i++) {
          multiplicando = parseInt( numeroPIS.substring( i, i + 1 ) );
          multiplicador = parseInt( multiplicadorBase.substring( i, i + 1 ) );
          total += multiplicando * multiplicador;
      }

      resto = 11 - total % 11;
      resto = resto === 10 || resto === 11 ? 0 : resto;

      digito = parseInt("" + numeroPIS.charAt(10));
      return resto === digito;
  }
}

function validarCPF(val) {
  if (val.length == 14) {
      var cpf = val.trim();
   
      cpf = cpf.replace(/\./g, '');
      cpf = cpf.replace('-', '');
      cpf = cpf.split('');
      
      var v1 = 0;
      var v2 = 0;
      var aux = false;
      
      for (var i = 1; cpf.length > i; i++) {
          if (cpf[i - 1] != cpf[i]) {
              aux = true;   
          }
      } 
      
      if (aux == false) {
          return false; 
      } 
      
      for (var i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
          v1 += cpf[i] * p; 
      } 
      
      v1 = ((v1 * 10) % 11);
      
      if (v1 == 10) {
          v1 = 0; 
      }
      
      if (v1 != cpf[9]) {
          return false; 
      } 
      
      for (var i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
          v2 += cpf[i] * p; 
      } 
      
      v2 = ((v2 * 10) % 11);
      
      if (v2 == 10) {
          v2 = 0; 
      }
      
      if (v2 != cpf[10]) {
          return false; 
      } else {   
          return true; 
      }
  } else if (val.length == 18) {
      var cnpj = val.trim();
      
      cnpj = cnpj.replace(/\./g, '');
      cnpj = cnpj.replace('-', '');
      cnpj = cnpj.replace('/', ''); 
      cnpj = cnpj.split(''); 
      
      var v1 = 0;
      var v2 = 0;
      var aux = false;
      
      for (var i = 1; cnpj.length > i; i++) { 
          if (cnpj[i - 1] != cnpj[i]) {  
              aux = true;   
          } 
      } 
      
      if (aux == false) {  
          return false; 
      }
      
      for (var i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
          if (p1 >= 2) {  
              v1 += cnpj[i] * p1;  
          } else {  
              v1 += cnpj[i] * p2;  
          } 
      } 
      
      v1 = (v1 % 11);
      
      if (v1 < 2) { 
          v1 = 0; 
      } else { 
          v1 = (11 - v1); 
      } 
      
      if (v1 != cnpj[12]) {  
          return false; 
      } 
      
      for (var i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) { 
          if (p1 >= 2) {  
              v2 += cnpj[i] * p1;  
          } else {   
              v2 += cnpj[i] * p2; 
          } 
      }
      
      v2 = (v2 % 11); 
      
      if (v2 < 2) {  
          v2 = 0;
      } else { 
          v2 = (11 - v2); 
      } 
      
      if (v2 != cnpj[13]) {   
          return false; 
      } else {  
          return true; 
      }
  } else {
      return false;
  }
}

function validarSenhas(senha, confirmacao){
  if(senha.localeCompare(confirmacao) === 0){
    return true;
  }
}

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [pis, setPis] = useState("");
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState("");
  const [rua, setRua] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [municipio, setMunicipio] = useState(""); 
  const [cad, setCad] = useState(false); 
  const MySwal = withReactContent(Swal);

  function onSubmit () {
    let retorno
    if(validarCPF(cpf)){
      if(validarPIS(pis)){
        if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
          if(validarSenhas(senha, confirmacao)){
            setCad(true);            
          }
          else {
            retorno ='A senha e a confirmação de senha não conferem'
          }
        } else {
          retorno ='Insira um Email válido'
        }
      } else {
        retorno ='Insira um PIS válido, como XXXXXXXXXXX, sem caracteres especiais'
      }
    } else{
      retorno ='Insira um CPF válido, como XXX.XXX.XXX-XX, sem caracteres especiais'
    }
    
    if(cad === true){
      let body = {
        nome: nome,
        senha: senha,
        email: email, 
        cpf: cpf,
        pis: pis,
        endereco: {
          pais: pais,
          estado: estado,
          rua: rua,
          cep: cep,
          numero: numero,
          complemento: complemento,
          municipio: municipio
        }
      }
      let config = { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(body)
      };
      let status = 0
      fetch(Host.url+'/cadastro-usuario', config).then((response) => {
        status = response.status
        return response.json()
      }).then((response) => {
        if(status === 201) {
          MySwal.fire({
            title: 'Cadastro efetuado com sucesso',
            icon: 'success',
            timer: 3000
          })
          Router.push('/')
      } else if(status === 500) {
        MySwal.fire({
          title: response.error,
          icon: 'error',
          showCloseButton: true
        })
      }
      })
    } else if (cad === false ){
      MySwal.fire({
        title: retorno,
        icon: 'error',
        showCloseButton: true
      })
    }
  }
  
  return (
    <Flex
      w="90vw"
      h="150vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        width="100%"
        height="100%"
        maxWidth={420}
        maxHeight="100%"
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="2">
            <Heading as='h3' size='lg' textAlign="center">Cadastre-se</Heading>
            <Input name="nome" type="nome" label="Nome" onChange={(value)=>{setNome(value.target.value)}}/>
            <Input name="email" type="email" label="Email" onChange={(value)=>{setEmail(value.target.value)}}/> 
            <Stack spacing={4} direction="row">
                <Input name="cpf" type="cpf" label="CPF" onChange={(value)=>{setCpf(value.target.value)}}/>
                <Input name="pis" type="pis" label="PIS" onChange={(value)=>{setPis(value.target.value)}}/> 
            </Stack>  
            <Stack spacing={4} direction="row">                  
                <Input name="password" type="password" label="Senha" onChange={(value)=>{setSenha(value.target.value)}}/>
                <Input name="password2" type="password" label="Confirme a Senha" onChange={(value)=>{setConfirmacao(value.target.value)}}/>
            </Stack>
            <Stack spacing={4} direction="row">
                <Input name="pais" type="pais" label="Pais" onChange={(value)=>{setPais(value.target.value)}}/>
                <Input name="Estado" type="Estado" label="Estado" onChange={(value)=>{setEstado(value.target.value)}}/> 
            </Stack>
            <Input name="municipio" type="municipio" label="Municipio" onChange={(value)=>{setMunicipio(value.target.value)}}/>
            <Input name="rua" type="rua" label="Rua" onChange={(value)=>{setRua(value.target.value)}}/>
            <Stack spacing={4} direction="row">
                <Input name="cep" type="cep" label="CEP" onChange={(value)=>{setCep(value.target.value)}}/>
                <Input name="numero" type="numero" label="Numero" onChange={(value)=>{setNumero(value.target.value)}}/> 
            </Stack>
            <Input name="complemento" type="complemento" label="Complemento" onChange={(value)=>{setComplemento(value.target.value)}}/>
                              
        </Stack>
        <Stack spacing="4">
          <Button
            mt="6"
            type="submit"
            colorScheme="pink"
            onClick={(e)=>{
              e.preventDefault()
              onSubmit()
            }}
          >
            Cadastrar
          </Button>
          <Link textAlign="center" href="/">Já tenho cadastro</Link>
        </Stack>
      </Flex>
    </Flex>
  )
}
