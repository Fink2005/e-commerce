export interface Order {
  id: string;
  customer: string;
  package: string;
  amount: number;
  status: 'processing' | 'completed' | 'pending';
  date: string;
}