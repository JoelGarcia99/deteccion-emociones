export interface User {
  id: string;
  email: string;
  emailRecuperacion?: string;
  nombre: string;
  fechaNacimiento: Date;
  createdAt: Date;
  updatedAt: Date;
}
