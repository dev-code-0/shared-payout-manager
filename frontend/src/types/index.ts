
export interface Profile {
  id: string;
  nombre: string;
  pin: string;
  propietario: string;
  correo: string;
  plataforma: string;
  monto: number;
  fecha_pago: number;
  estado_pago: 'pagado' | 'pendiente';
}

export interface PaymentStats {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  pendingCount: number;
  totalCount: number;
}

export interface User {
  id: string;
  username: string;
  token: string;
}
