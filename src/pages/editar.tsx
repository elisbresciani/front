import {Flex, Button, Stack, Heading, Link } from '@chakra-ui/react'
import { Input } from '../components/Form/Input'
import { useEffect, useState } from 'react'
import cookie from 'js-cookie'
import Host from '../controllers/url'
import Router from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function editar() {    
    const [id, setId] = useState("");
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
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if(cookie.get("token") == undefined || localStorage.getItem('usuario') == null){
            Router.push('/')
        }
        if(cookie.get("token")){
            setId(JSON.parse(localStorage.usuario).idUsuario)
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
    
    function onDeleteAccount () {   
        MySwal.fire({
            title: 'Você tem certeza?',
            text: 'Você não poderá recurperar sua conta novamente caso excluir!',
            icon: 'warning',
            timer: 3000,
            showCancelButton: true,
            confirmButtonColor: 'red',
            confirmButtonText: 'Sim, exclua!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,

        }).then((result) => {
            if (result.isConfirmed){ 
                let body = {
                    idUsuario: id
                }           
                let config = { 
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json', 
                        'authorization': cookie.get("token")
                    },
                    body: JSON.stringify(body)
                };
                let status = 0
                fetch(Host.url+'/excluir', config).then((response) => {
                    status = response.status
                    return response.json()
                }).then((data) => {
                    if(status === 200) {
                        localStorage.clear();
                        cookie.remove('token');
                        Router.push('/'); 
                    } else if(status === 500) {
                        MySwal.fire({
                            title: data.error,
                            icon: 'error',
                            showCloseButton: true
                        })
                    }
                })

            }
        })
    }

    function salvar() {
        MySwal.fire({
            text: 'Voce deseja realmente alterar seus dados?',
            timer: 3000,
            showCancelButton: true,
            confirmButtonColor: 'blue',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,

        }).then((result) => {
            if (result.isConfirmed){
                console.log(id)
                let body = {
                    idUsuario: id,
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
                    headers: {
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json', 
                        'authorization': cookie.get("token")
                    },
                    body: JSON.stringify(body)
                };
                let status = 0
                fetch(Host.url+'/alterar', config).then((response) => {
                    status = response.status
                    return response.json()
                }).then((data) => {
                    if(status === 201) {
                        localStorage.clear();
                        cookie.remove('token');
                        localStorage.setItem('usuario', JSON.stringify(data));
                        cookie.set('token', JSON.stringify(data.token));          
                        Router.push('/inicial')
                    } else if(status === 500) {
                        MySwal.fire({
                            title: data.error,
                            icon: 'error',
                            showCloseButton: true
                        })
                    }
                })

            }
        })
    }

  return (
    <Flex
      w="90vw"
      h="160vh"
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
            <Input
              name="nome"
              type="nome"
              label="Nome"
              defaultValue={nome}
              onChange={(value)=>{setNome(value.target.value)}}
            />
            <Input name="email" type="email" label="Email" defaultValue={email} onChange={(value)=>{setEmail(value.target.value)}}/> 
            <Stack spacing={4} direction="row">
                <Input name="cpf" type="cpf" label="CPF" defaultValue={cpf} onChange={(value)=>{setCpf(value.target.value)}}/>
                <Input name="pis" type="pis" label="PIS" defaultValue={pis} onChange={(value)=>{setPis(value.target.value)}}/> 
            </Stack>  
            <Stack spacing={4} direction="row">                  
                <Input name="password" type="password" label="Senha" onChange={(value)=>{setSenha(value.target.value)}}/>
                <Input name="password2" type="password" label="Confirme a Senha" onChange={(value)=>{setConfirmacao(value.target.value)}}/>
            </Stack>
            <Stack spacing={4} direction="row">
                <Input name="pais" type="pais" label="Pais" defaultValue={pais} onChange={(value)=>{setPais(value.target.value)}}/>
                <Input name="Estado" type="Estado" label="Estado" defaultValue={estado} onChange={(value)=>{setEstado(value.target.value)}}/> 
            </Stack>
            <Input name="municipio" type="municipio" label="Municipio" defaultValue={municipio} onChange={(value)=>{setMunicipio(value.target.value)}}/>
            <Input name="rua" type="rua" label="Rua" defaultValue={rua} onChange={(value)=>{setRua(value.target.value)}}/>
            <Stack spacing={4} direction="row">
                <Input name="ceo" type="cep" label="CEP" defaultValue={cep} onChange={(value)=>{setCep(value.target.value)}}/>
                <Input name="numero" type="numero" label="Numero" defaultValue={numero} onChange={(value)=>{setNumero(value.target.value)}}/> 
            </Stack>
            <Input name="complemento" type="complemento" label="Complemento" defaultValue={complemento} onChange={(value)=>{setComplemento(value.target.value)}}/>
                              
        </Stack>
        <Stack spacing="4">
          <Button
            mt="6"
            type="submit"
            colorScheme="green"
            onClick={(e)=>{
                e.preventDefault()
                salvar()
            }}
          >
            Salvar
          </Button>
          <Button
            mt="6"
            type="submit"
            colorScheme="red"
            onClick={(e)=>{
              e.preventDefault()
              onDeleteAccount()
            }}
          >
            Excluir Conta
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
}
