import {getTarefas, autorizar, login} from "../handler.js";
import tarefa from "../schemas/Tarefa.js";

import { jest } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", ()=> ({
  verify: jest.fn()
}));

const { autorizar } = await import("../handler.js");
const jwt = await import("jsonwebtoken");

describe("Testando funcao de autorizar Token JWT", ()=>{
  afterEach(() =>{
    jest.clearAllMocks();
  });

  it("Deveria retornar 401 por nao enviar authorization", async ()=>{

    //ARRANGE
    const event = {headers: {}};
    bodyEsperado = "\"Credenciais de Autorização devem ser enviadas\"";

    //ACT = autorizar
    const response = await autorizar(event);

    //ASSERT
    expect(response.statusCode).toBe(401);
    expect(response.body).toBe(bodyEsperado);
  });

  it("Deveria retornar 401 ao enviar tipo de token invalido", async ()=>{

    //ARRANGE
    const event = {headers :{authorization: "Basic abc123"}};
    bodyEsperado = "\"Tipo de token inválido\"";

    //ACT
    const response = await autorizar(event);

    //ASSERT
    expect(response.statusCode).toBe(401);
    expect(response.body).toBe(bodyEsperado);
  });

  it("Deveria retornar 401 ao fornecer token invalido", async ()=>{

    //ARRANGE
    const event = {headers: {authorization: "Bearer 123123"}};
    const bodyEsperado = "{\"error\":\"Token inválido\"}";

    jwt.verify.mockImplementation(() =>{
      throw new Error("Token inválido");
    });

    //ACT
    const response = await autorizar(event);
    
    //ASSERT
    expect(response.statusCode).toBe(401);
    expect(response.body).toBe(bodyEsperado);
  });

  it("Deveria autorizar usuario", async ()=>{

    //ARRANGE
    const event = {headers : {authorization: "Bearer 123123"}};
    
    jwt.verify.mockImplementation(() =>{
      return {
        usernameLogin: "Teste",
        id: "123",
        aud: "Teste-serverless"
      }});

    //ACT
    const response = await autorizar(event);

    //ASSERT
    expect(response.usernameLogin).toBe("Teste");
  })
});