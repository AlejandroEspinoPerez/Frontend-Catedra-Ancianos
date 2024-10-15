export interface Enfermedades {
  id: number;
  nombre_enfermedad: string;
  fecha_diagnostico: string;
  descripcion: string;
  medicamento: string;
  anciano_nombre?: string;  // Agregamos el nombre del anciano
}
