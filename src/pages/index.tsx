import {Flex, Button, Stack, Heading, Link, cookieStorageManager } from '@chakra-ui/react'
import { Input } from '../components/Form/Input'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import Host from '../controllers/url'
import { config } from 'process'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import cookie from 'js-cookie'
import Router from 'next/router'

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

function validarCPF(cpf) {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	let add = 0;	
	for (let i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		let rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (let i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}

function validateLogin(value){
  let var1 
  if(!value) {
    return 'Por favor insira o login';
  } else if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)){
    return 'Email'
  } else if (validarPIS(value)) {
    return 'PIS'
  } else if(validarCPF(value)){
    return 'CPF'
  } else {
    return 'Insira um login valido'
  }

}


export default function Index() {
  const [senha, setSenha] = useState("");
  const [login, setLogin] = useState("");
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if(cookie.get("token")){
      Router.push('/inicial')
    }
  }, []);


  function onSubmit () {
      let retorno = validateLogin(login)
      if(retorno == 'Por favor insira o login') return;      
      let body = {
        login: login,
        senha: senha,
        tipo: retorno
      }
      let config = { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(body)
      };
      let status = 0
      fetch(Host.url+'/login', config).then((response) => {
        status = response.status
        return response.json()
      }).then((data) => {
        if(status === 200) {
          MySwal.fire({
            title: 'Login efetuado com sucesso',
            icon: 'success',
            timer: 3000
          })
          localStorage.setItem('usuario', JSON.stringify(data));
          cookie.set('token', JSON.stringify(data.token));          
          Router.push('/home')
      } else if(status === 401) {
        MySwal.fire({
          title: data.error,
          icon: 'error',
          showCloseButton: true
        })
      }
      })
  }
  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Heading as='h3' size='lg' textAlign="center">Olá, Visitante!</Heading>
          <Input name="login" type="login" label="Email, CPF ou PIS" onChange={(value)=>{setLogin(value.target.value)}}/>
          <Input name="senha" type="password" label="Senha" onChange={(value)=>{setSenha(value.target.value)}}/>            
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
            Entrar
          </Button>
          <Link textAlign="center" href="/cadastro">Cadastre-se</Link>
        </Stack>
      </Flex>
    </Flex>
  )
}
