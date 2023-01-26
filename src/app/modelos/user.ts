export type User = {
  id:number
  pNombre:string,
  sNombre:string,
  apPaterno:string,
  apMaterno:string,
  usuario:string,
  rut:string,
  password:string,
  correo:string,
  tipo:string
}

export type UserResponse = [
  {
    id:number
    pNombre:string,
    sNombre:string,
    apPaterno:string,
    apMaterno:string,
    usuario:string,
    rut:string,
    password:string,
    correo:string,
    tipo:string
  }
]

