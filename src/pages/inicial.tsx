import {Flex, Button, Stack, Heading, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import cookie from 'js-cookie'
import Host from '../controllers/url'
import Router from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Inicial() {
  useEffect(() => {
    if(cookie.get("token") == undefined || localStorage.getItem('usuario') == null){
      Router.push('/')
    }
    if(cookie.get("token")){
      setNome(JSON.parse(localStorage.usuario).nome)
      setEmail(JSON.parse(localStorage.usuario).email)
      setCpf(JSON.parse(localStorage.usuario).CPF)
      setPis(JSON.parse(localStorage.usuario).PIS)
      setPais(JSON.parse(localStorage.usuario).endereco.Pais)
      setEstado(JSON.parse(localStorage.usuario).endereco.Estado)
      setRua(JSON.parse(localStorage.usuario).endereco.Rua)    
      setCep(JSON.parse(localStorage.usuario).endereco.CEP)
      setNumero(JSON.parse(localStorage.usuario).endereco.Numero)
      setComplemento(JSON.parse(localStorage.usuario).endereco.Complemento)
      setMunicipio(JSON.parse(localStorage.usuario).endereco.Municipio)
    }
  }, []);
  const [nome, setNome] = useState("");
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
  const MySwal = withReactContent(Swal);

  function Sair () {
    MySwal.fire({
        title: 'Você tem certeza?',
        text: 'Você tem certeza que deseja sair?',
        icon: 'warning',
        timer: 3000,
        showCancelButton: true,
        confirmButtonColor: 'red',
        confirmButtonText: 'Sim!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed){            
          localStorage.clear();
          cookie.remove('token');
          Router.push('/');            
        }
    })
  }


  function alterar(){
    MySwal.fire({
      text: 'Você quer editar seus dados?',
      timer: 3000,
      showCancelButton: true,
      confirmButtonColor: 'blue',
      confirmButtonText: 'Sim!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
  }).then((result) => {
      if (result.isConfirmed){   
        Router.push('/editar');            
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
            <Heading as='h3' size='lg' textAlign="center">Olá, {nome}!</Heading>
            <Heading as='h5' size="md" textAlign="center">Seus dados:</Heading>
            <Stack spacing="2">
                <label>Email: {email}</label>
                <label>PIS: {pis}</label>
                <label>CPF: {cpf}</label>
                <label>Pais: {pais}</label>
                <label>Estado: {estado}</label>
                <label>Cidade: {municipio}</label>
                <label>Rua: {rua}</label>
                <label>Numero: {numero}</label>
                <label>CEP: {cep}</label>
                <label>Complemento: {complemento}</label>
            </Stack>
            <Button
                mt="6"
                type="submit"
                colorScheme="blue"
                onClick={(e)=>{
                  e.preventDefault()
                  alterar()
                }}
            >
                Editar dados
            </Button>
            <Button
                mt="6"
                type="submit"
                colorScheme="red"
                onClick={(e)=>{
                  e.preventDefault()
                  Sair()
                }}
            >
                Sair
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
}
